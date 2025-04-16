let miningInterval;
let miningEndTime;

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(e => alert(e.message));
}

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const urlParams = new URLSearchParams(window.location.search);
  const referrerId = urlParams.get("ref");

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      const uid = cred.user.uid;
      const userRef = db.collection("users").doc(uid);

      userRef.set({
        balance: 0,
        referredBy: referrerId || null
      });

      if (referrerId) {
        const refUserRef = db.collection("users").doc(referrerId);
        refUserRef.get().then(doc => {
          if (doc.exists) {
            const currentBalance = doc.data().balance || 0;
            refUserRef.update({ balance: currentBalance + 5 }); // 🎁 referral bonus
          }
        });
      }
    })
    .catch(e => alert(e.message));
}

function logout() {
  auth.signOut();
}

function startMining() {
  const user = auth.currentUser;
  if (!user) return;

  miningEndTime = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

  logMiningHistory(user.uid); // ⛏️ Log start time

  miningInterval = setInterval(() => {
    const now = Date.now();
    if (now >= miningEndTime) {
      clearInterval(miningInterval);
      document.getElementById('timer-display').innerText = "Mining completed!";
      return;
    }

    updateBalance(user.uid, 0.1);
    updateTimerDisplay(miningEndTime - now);
  }, 60000); // every minute
}

function updateBalance(uid, amount) {
  const userRef = db.collection("users").doc(uid);
  userRef.get().then(doc => {
    const current = doc.exists ? doc.data().balance || 0 : 0;
    userRef.set({ balance: current + amount }, { merge: true });
    document.getElementById("coin-balance").innerText = (current + amount).toFixed(2);
  });
}

function updateTimerDisplay(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  document.getElementById("timer-display").innerText = `Time left: ${hours}h ${minutes}m`;
}

function logMiningHistory(uid) {
  const historyRef = db.collection("users").doc(uid).collection("miningHistory");
  historyRef.add({
    startTime: firebase.firestore.Timestamp.now()
  });
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("mining-section").style.display = "block";
    document.getElementById("user-name").innerText = user.email;

    const userRef = db.collection("users").doc(user.uid);
    userRef.get().then(doc => {
      const balance = doc.exists ? doc.data().balance || 0 : 0;
      document.getElementById("coin-balance").innerText = balance.toFixed(2);
    });

    // 💬 Show referral link
    const refLink = `${window.location.origin}?ref=${user.uid}`;
    const refDisplay = document.createElement('p');
    refDisplay.innerHTML = `Your referral link: <br><a href="${refLink}">${refLink}</a>`;
    document.getElementById("mining-section").appendChild(refDisplay);

    // 🟢 Hook up mining button
    document.getElementById("start-mining").addEventListener("click", startMining);
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("mining-section").style.display = "none";
  }
});
