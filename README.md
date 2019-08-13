# G2: Common ideology.
By idea, it must be lighweight fast tool for SVG-rendering purposes:
- It must be really lightweight.
- It must be really fast.
- It must cover all basic SVG functionality.
- Keep as close to browser functionality as it possible. It means that we'll try to use browser features instead of reimplementing own ones just because browser's developers think of performance and usability much more than we do.
- Bring heavyweight things to extensions.

# General developer tips: 
- Avoid necrophilia. Don't try to support really bad things (like IE or not actual versions of another browsers) if most of the world already uses newer features.
- All DOM-references must be nullable for disposing purposes to avoid memory-leaks.
- Try to export and make public as many useful fields as it possible to give developers an ability to extend functionality as they wish.
- Don't think instead of user. If user does something wrong - he suffers.
- All heavyweight features must be brought to extensions to follow the common ideology.
- Give user an ability to use heavyweight features and to be responsible for it: user must realize that all inclusions makes all work slower.
- Make it all as simple as possible. Don't try to demonstrate your ability to write the complex code, nobody needs it in this project.
- Remove your fingers away from the keyboard and think twice.
- Comment is your best friend.
- Be friends with profiler. Performance must reach the Vanilla-JS implementation.
- Aviod browser-blocking operations.
- Let the browser work for you, don't reimplement browser's features.
- Follow the fundamentals like this: https://developers.google.com/web/fundamentals/

# G2, architecture tips.
- Despite G2 still uses wrappers (like G2Element or stage) over real DOM-elements, wrapper creates dom-element immediately. 
- It is pretty fast if developer follows browser's lifecycle and avoids forced reflow like https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
- All detached operations over DOM-element must be preformed by setting queue. Stage.render() actually executes child elements' queues. It is an analogue of clearing elements' consistency states.
- THIS MUST BE RESERCHED!!!! ~~Don't implement separated util classes for common features with own API. Use simple typed objects instead and make operations in static util functions like~~: 
```typescript
//BAD: 
class Rect {
    constructor(public left: number = 0, public top: number = 0, public width: number = 0, public height: number = 0) { }

    public clone() {
        return new Rect(this.left, this.top, this.width, this.height);
    }
}

//GOOD:
const rect: Rect = {left: 0, top: 0, width: 0, height: 0};
const clone = someStaticUtils.clone(rect);
```


```javascript
//SOMETHING THAT MUST BE RESEARCHED
class Rect {
    constructor(left = 0, top = 0, width = 0, height = 0) {
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;
    }

    clone() {
        return new Rect(this.left, this.top, this.width, this.height);
    }
}

const Rect1 = function(left, top, width, height) {
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
}

Rect1.prototype.clone = function() {
	return new Rect1(this.left, this.top, this.width, this.height);
}

function clone(r) {
 return {left, top, width, height} = r;
}

const storage1 = [];
const storage2 = [];
const storage3 = [];

const st1 = performance.now();
for (let i = 0; i < 1000000; i++) {
 const r = new Rect(Math.random(), Math.random(), Math.random(), Math.random());
 const cl = r.clone();
 storage1.push(cl);
}
console.log(performance.now() - st1);

const st2 = performance.now();
for (let i = 0; i < 1000000; i++) {
 const r = {left: Math.random(),top: Math.random(), width: Math.random(), height: Math.random()};
 const cl = clone(r);
 storage2.push(cl);
}
console.log(performance.now() - st2);

const st3 = performance.now();
for (let i = 0; i < 1000000; i++) {
 const r = new Rect1(Math.random(), Math.random(), Math.random(), Math.random());
 const cl = clone(r);
 storage3.push(cl);
}
console.log(performance.now() - st3);

//OUTPUT:
798
1620
3058
```

#G2 current dev tips
This section contains feateures to be inpmlemented or currently implemented and must be tipped.
- 