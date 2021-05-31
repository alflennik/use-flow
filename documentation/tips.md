## Tips

### Make useFlow an Implementation Detail

Use Flow is intended to hide inside your hooks or components where its power is needed, but from the outside, all your hooks' consumers see is a hook's normal API or a normal React component.

### Wait Until You Need It

It is probably not a great idea to use useFlow until you have started hitting complexity walls with the normal toolkit of hooks. Likewise, even when you have already started using useFlow, most hooks and especially most components will not need it.

### Testing

Since useFlow hides within a hook or a component, there is no need for anything special towards testing - just keep testing the way you normally would.

A great way to test hooks hooks in general is a library called mount-hook, created by the same author of this library. It allows you to run hooks within your tests, which otherwise is incredibly tricky to do.