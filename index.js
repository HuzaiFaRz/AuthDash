import { auth, signOut, onAuthStateChanged } from "./firebase.js";
const logOutBtn = document.querySelector(".logout-btn");
const userEmail = document.querySelector(".userEmail");
const userCheck = document.querySelector(".alert-main");

window.addEventListener("load", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (userCheck) {
        userCheck.style.display = "none";
      }
      if (userEmail) {
        userEmail.textContent = `Hi! ${user.email}`;
      }
      const uid = user.uid;
    } else {
      if (userCheck) {
        userCheck.style.display = "flex";
      }
    }
  });
});

const resetLogOutButton = () => {
  logOutBtn.innerHTML = `Log Out`;
  logOutBtn.style.opacity = "1";
  logOutBtn.style.cursor = "pointer";
};

const showToast = (massege, background) => {
  Toastify({
    text: `${massege}`,
    position: "center",
    duration: 3000,
    style: {
      background: `${background}`,
      color: "#fbfcf8",
      fontSize: "18px",
    },
  }).showToast();
};

const passwordIcon = document.querySelectorAll(".password-icon");
const floatingPassword = document.querySelectorAll("#floatingPassword");

if (logOutBtn) {
  logOutBtn.addEventListener("click", () => {
    logOutBtn.innerHTML = ` Log Out <i class="spinner-border spinner-border-sm text-light" role="status"></i>`;
    logOutBtn.style.opacity = "0.5";
    logOutBtn.style.cursor = "not-allowed";
    signOut(auth)
      .then(() => {
        resetLogOutButton();
        showToast("Sign Out SuccessFully", "rgb( 25, 135, 84)");
        window.location.replace("http://127.0.0.1:5500/Login/login.html");
      })
      .catch((error) => {
        resetLogOutButton();
        const errorCode = error.code;
        const errorMessage = error.message;
        showToast(errorMessage, "rgb(220, 53, 69)");
      });
  });
}
if (passwordIcon) {
  Array.from(passwordIcon).forEach((passwordIconElem, passwordIconIndex) => {
    passwordIconElem.addEventListener("click", () => {
      passwordIconElem.classList.toggle("password-icon-active");
      if (passwordIconElem.classList.contains("password-icon-active")) {
        passwordIconElem.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
        floatingPassword[passwordIconIndex].setAttribute("type", "text");
      } else {
        passwordIconElem.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
        floatingPassword[passwordIconIndex].setAttribute("type", "password");
      }
    });
  });
}

const addTaskTextInput = document.querySelector("#AddTaskTextInput");
const addTaskBtn = document.querySelector("#AddTaskBtn");
const todoItems = document.querySelector(".todo-items");
const toDoFunctionility = () => {
  if (!addTaskTextInput.value) {
    showToast("Write Task In Input", "rgb(220, 53, 69)");
    return;
  }

  todoItems.innerHTML += ` <li  class="task w-100 gap-1 px-3 py-2 border-bottom border-2 border-black">
  <span class="task-text fs-6 fw-medium text-dark"> ${addTaskTextInput.value}</span> 
  <div class="todo-btns w-100 d-flex flex-wrap justify-content-evenly align-items-center py-2 px-2" >
  <div class="task-edit btn btn-outline-success fw-medium fs-5 rounded-4 px-5 py-2 border-1">Edit</div>
  <div class="task-delete btn btn-outline-danger fw-medium fs-5 rounded-4 px-5 py-2 border-1"> Delete</div> </div></li>`;
  showToast("Task Added", "rgb( 25, 135, 84)");
};

addTaskBtn.addEventListener("click", toDoFunctionility);
