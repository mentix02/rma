// Can't use Bootstrap's javascript because it's an assignment requirement
const messageDiv = document.querySelector("#message");
const closeBtn = document.querySelector("#close");

if (closeBtn)
  closeBtn.addEventListener("click", function() {
    messageDiv.remove();
  });