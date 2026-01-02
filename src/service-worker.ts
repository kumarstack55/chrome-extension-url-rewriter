chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);
  switch (command) {
    default:
      console.log(`Command "${command}" is not supported.`);
  }
});
