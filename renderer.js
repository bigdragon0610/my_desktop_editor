require.config({ paths: { vs: "./node_modules/monaco-editor/min/vs" } });

const editorContainer = document.getElementById("container");
const consoleSection = document.getElementById("console");

let editor = "";
let prevEditorValue = 'console.log("Hello world!");\n';
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(editorContainer, {
    value: [prevEditorValue].join("\n"),
    language: "javascript",
    theme: "vs-dark",
  });
  window.addEventListener("resize", () => {
    editor.layout();
  });
});

// save changes
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    prevEditorValue = editor.getValue();
  }
});

const restoreButton = document.getElementById("restore_button");
restoreButton.addEventListener("click", () => {
  editor.setValue(prevEditorValue);
});

const consoleLog = (content) => {
  consoleSection.insertAdjacentHTML(
    "beforeend",
    `<p class="console_log">${content}</p>`
  );
};

const consoleError = (error) => {
  consoleSection.insertAdjacentHTML(
    "beforeend",
    `<p class="console_error">${error}</p>`
  );
};

const consoleClear = () => {
  consoleSection.innerHTML = "";
};

{
  // rewrite the standard "console" object for userFunc
  const console = {
    log: consoleLog,
    error: consoleError,
    clear: consoleClear,
  };

  const runButton = document.getElementById("run_button");
  runButton.addEventListener("click", () => {
    const editorValue = editor.getValue();
    const userFunc = new Function("console", editorValue);
    try {
      consoleClear();
      userFunc(console);
      prevEditorValue = editor.getValue();
    } catch (error) {
      consoleError(error);
    }
  });

  const clearButton = document.getElementById("clear_button");
  clearButton.addEventListener("click", () => {
    prevEditorValue = editor.getValue();
    editor.setValue("");
    consoleClear();
  });
}
