(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener('message', event => {
        const message = event.data;

        switch (message.type) {
            default:
                console.log(message);
                break;
        }
    });
})();