import {
  showToast,
  auth,
  createUserWithEmailAndPassword,
  db,
  storage,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../firebase.js";
const signUpForm = document.querySelector(".signup-form");
const signUpSubmitBtn = document.querySelector("#SignUpBtn");
const alertMain = document.querySelector(".alert-main");
const resetSignUpButton = () => {
  signUpSubmitBtn.innerHTML = `Sign Up`;
  signUpSubmitBtn.style.opacity = "1";
  signUpSubmitBtn.style.cursor = "pointer";
  signUpSubmitBtn.disabled = false;
};

const signUpFunctionility = async () => {
  event.preventDefault();
  const signUpFormData = new FormData(signUpForm);
  const signUpUserInformaTion = {
    signUpName: signUpFormData.get("SignUpName"),
    signUpEmail: signUpFormData.get("SignUpEmail"),
    signUpPhoneNumber: signUpFormData.get("SignUpPhoneNumber"),
    signUpPassword: signUpFormData.get("SignUpPassword"),
    signUpConfirmPassword: signUpFormData.get("SignUpConfirmPassword"),
    signUpProfile: signUpFormData.get("SignUpProfile"),
    signedUpUserTime: new Date(),
  };
  if (
    !signUpUserInformaTion.signUpName ||
    !signUpUserInformaTion.signUpEmail ||
    !signUpUserInformaTion.signUpPhoneNumber ||
    !signUpUserInformaTion.signUpPassword ||
    !signUpUserInformaTion.signUpConfirmPassword
  ) {
    showToast("Fill All Field", "#B00020");
    resetSignUpButton();
    return;
  } else if (
    !signUpUserInformaTion.signUpProfile ||
    !signUpUserInformaTion.signUpProfile.name
  ) {
    showToast("Upload Profile Photo", "#B00020");
    resetSignUpButton();
    return;
  }
  if (
    signUpUserInformaTion.signUpPassword !==
    signUpUserInformaTion.signUpConfirmPassword
  ) {
    showToast("Password Does Not Match", "#B00020");
    resetSignUpButton();
    return;
  }
  signUpSubmitBtn.innerHTML = ` Sign Up <i class="spinner-border spinner-border-sm text-light" role="status"> </i>`;
  signUpSubmitBtn.style.opacity = "0.5";
  signUpSubmitBtn.style.cursor = "not-allowed";
  signUpSubmitBtn.disabled = true;
  alertMain.style.display = "flex";
  alertMain.innerHTML = `<div class="spinner-grow text-light" role="status" style="width: 3rem; height: 3rem; z-index:9999;" ></div>`;

  createUserWithEmailAndPassword(
    auth,
    signUpUserInformaTion.signUpEmail,
    signUpUserInformaTion.signUpPassword
  )
    .then((userCredential) => {
      const user = userCredential.user;
      const userRef = ref(storage, `Users/${userCredential.user.uid}`);
      uploadBytes(userRef, signUpUserInformaTion.signUpProfile)
        .then((a) => {
          getDownloadURL(userRef)
            .then((URL) => {
              signUpUserInformaTion.signUpProfile = URL;
              const userDocRef = doc(db, "Users", userCredential.user.uid);
              setDoc(userDocRef, signUpUserInformaTion)
                .then((b) => {
                  alertMain.style.display = "none";
                  alertMain.innerHTML = "";
                  showToast("SignUp SuccessFully", "rgb( 25, 135, 84)");
                  signUpForm.reset();
                  resetSignUpButton();
                  window.location.href = "../Login/login.html";
                })
                .catch((error) => {
                  alertMain.style.display = "none";
                  alertMain.innerHTML = "";
                  showToast(error, "#B00020");
                });
            })
            .catch((error) => {
              alertMain.style.display = "none";
              alertMain.innerHTML = "";
              showToast(error, "#B00020");
            });
        })
        .catch((error) => {
          alertMain.style.display = "none";
          alertMain.innerHTML = "";
          showToast(error, "#B00020");
        });
    })
    .catch((error) => {
      alertMain.style.display = "none";
      alertMain.innerHTML = "";
      showToast(error.message, "#B00020");
      resetSignUpButton();
    });
};

const passwordsIconsFunctionility = () => {
  const passwordIcons = document.querySelectorAll(".password-icon");
  const passwordInputs = document.querySelectorAll("#password-input");

  Array.from(passwordIcons).forEach((passwordIconElem, passwordIconIndex) => {
    passwordIconElem.addEventListener("click", () => {
      passwordIconElem.classList.toggle("password-icon-active");
      if (passwordIconElem.classList.contains("password-icon-active")) {
        passwordIconElem.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
        passwordInputs[passwordIconIndex].setAttribute("type", "text");
      } else {
        passwordIconElem.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
        passwordInputs[passwordIconIndex].setAttribute("type", "password");
      }
    });
  });
};

passwordsIconsFunctionility();

signUpForm.addEventListener("submit", signUpFunctionility);
