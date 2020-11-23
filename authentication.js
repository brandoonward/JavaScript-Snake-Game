const signup = document.getElementById('signup-form');
signup.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const display = document.getElementById('display-name').value;

    auth.createUserWithEmailAndPassword(email, password).then((user) => {
        return db.collection('players').doc(user.user.uid).set({
            highScore: 0,
            displayName: display
        }).then(() => {
            M.Modal.getInstance(document.getElementById('modal-signup')).close();
            signup.reset();
            document.getElementById('signup-success').innerHTML = '';
        });
    }).catch(err => {
        console.log(err);
        document.getElementById('signup-success').innerHTML = err.message;
    });
});

const logout = document.getElementById('logout');
logout.addEventListener("click", (event) => {
    event.preventDefault();

    firebase.auth().signOut().then(user => {

    });
});

const login = document.getElementById('login-form');
login.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password).then(user => {
        console.log(user);
        M.Modal.getInstance(document.getElementById('modal-login')).close();
        login.reset();
        document.getElementById('login-success').innerHTML = '';
    }).catch(err => {
        document.getElementById('login-success').innerHTML = err.message;
    });
    
    
});

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        db.collection('players').onSnapshot(scoreData => {
            setupLeaderboards(scoreData.docs);
            setupUI(user);
        });
    } else {
        setupLeaderboards([]);
        setupUI();
    }
});

const leaderboard = document.getElementById('rankingList');
const personalBoard = document.getElementById('personalList');
const loggedOut = document.querySelectorAll('.logged-out');
const loggedIn = document.querySelectorAll('.logged-in');
const accInfo = document.querySelector('.account-details');

async function setupUI(user) {
    if (user) {
        var personalScore;
        await db.collection('players').doc(user.uid).get().then(info => {
            personalScore = info.data().highScore;
            const html = `
            <div>Currently signed in as ${info.data().displayName}<br> Email: ${user.email}<br>Personal High Score: ${info.data().highScore}</div>`
            accInfo.innerHTML = html;
        });
        
        loggedIn.forEach(item => item.style.display = 'block');
        loggedOut.forEach(item => item.style.display = 'none');
        personalBoard.innerHTML = `<strong style="font-size:15pt;">${personalScore}</strong>`;
        
    } else {
        accInfo.innerHTML = '';
        loggedIn.forEach(item => item.style.display = 'none');
        loggedOut.forEach(item => item.style.display = 'block');
        personalBoard.innerHTML = 'Login to view your personal scores!';
    }
  };

const setupLeaderboards = (highScores) => {
    let arr=[];
    if (highScores.length != 0) {
        highScores.forEach(element => {
            arr.push(element);
        });
        for (let i=0; i<arr.length; i++) {
            for (let j=0; j<arr.length-1; j++) {
                if (arr[j].data().highScore < arr[j+1].data().highScore) {
                    let temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
        let html = '';
        if (arr.length >= 10) {
            for (let i=0; i<10; i++) {
                const data = arr[i].data();
                const li = `
                  <li style="font-size: 15pt; text-align: center;"><strong>
                  ${data.highScore} --- ${data.displayName}</strong>
                  </li>
                `
                html += li;
            }
        } else {
            arr.forEach(element => {
                const data = element.data();
                const li = `
                  <li style="font-size: 15pt; text-align: center;"><strong>
                  ${data.highScore}: ${data.displayName}</strong>
                  </li>
                `
                html += li;
              });
        }
        leaderboard.innerHTML = html;
    } else {
        leaderboard.innerHTML = 'Login to view the 426 High Scores!';
    }
  };

async function submitScore(user, score) {
    var personalHigh;
    var display;
    const userData = await db.collection('players').doc(user.uid).get().then(info => {
        personalHigh = info.data().highScore;
        display = info.data().displayName
    });
    if (score > personalHigh) {
        db.collection('players').doc(user.uid).set({
            highScore: score,
            displayName: display
        });
    }
};