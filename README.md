<div align="center">
<img src="./assets/icon.svg" height="200px" width="200px" />
<h1>a11yscore</h1>
</div>

> This project is not ready to use.
> It is temporarily archived since I will not develop this now and continue a few months later. (Goals are different/No time)

Objective is just to be able to do mass scoring and not fall into the trap of [Goodhart's Law](https://en.wikipedia.org/wiki/Goodhart%27s_law). 90+ is reasonable on Lighthouse. There are also plans to integrate with [@khan/tota11y](https://github.com/khan/tota11y) if i can convince them to [Rebuild](https://github.com/Khan/tota11y/issues/125#issuecomment-1531408687) it 

Powered by
|Creator| Tool|
|---|---|
|Google | Lighthouse (Axe) |
|**Soon**||
|Khan | tota11y|
|IBM| Karma|
|Independent | Pa11y|

Later we will not use `Google Lighthouse` since under the hood it basically uses `axe-core`, but right now thats basically what we are doing.

## Temporary Usage
This will be much cleaner once its done
```bash
$ node ./run.js
$ bun ./process.js
```

## Todos
- Add multiple retrys with https -> http -> full url without stripping query
- Add support for Karma, Pa11y & Tota11y for averaging & finding gaps better
- Add better report interpreation in simple words
