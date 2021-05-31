## Tips

### Make useFlow an Implementation Detail

Use Flow is intended to hide inside your hooks or components where its power is needed, but from the outside, all your hooks' consumers see is a hook's normal API or a normal React component.

### Wait Until You Need It

It is probably not a great idea to use useFlow until you have started hitting complexity walls with the normal toolkit of hooks. Likewise, even when using useFlow in several of your components, most hooks and especially most components will not need it.

### Testing's No Problem

Since useFlow hides within a hook or a component, there is no need for anything special towards testing - just keep testing the way you normally would.

A great way to test hooks hooks in general is a library called, well, test hook, created by the same author of this library. It allows you to consume hooks within your tests, which otherwise is incredibly tricky to do.