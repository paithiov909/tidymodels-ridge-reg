<script lang="ts">
	import {
		Presentation,
		Vertical,
		Slide,
		Step,
		Code
	} from '@components'
</script>

<Presentation>

	<Slide animate>
		<h1 class="font-bold text-8xl">
			tidymodelsで<br />
			リッジ回帰を<br />
			使ってみよう💪
		</h1>
	</Slide>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">モチベーション</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-6xl">モチベーション</h2>
			<p class="mt-4 text-4xl">
				こういう関数を
				<a class="text-green-300" href="https://parsnip.tidymodels.org/" target="_blank" rel="noreferrer">parsnip</a>
				で使いたい
			</p>
			<div class="mt-4">
				<Code lang="r">
					{`
					#' @param x Design matrix.
					#' @param y Response vector.
					#' @param lambda Regularization parameter.
					my_lm_impl <- function(x, y, lambda) {
						lambda_i <- diag(lambda, ncol(x))
						coef <-
							qr.solve(t(x) %*% x + lambda_i) %*% t(x) %*% y
						tibble::tibble(
							term = colnames(x),
							estimate = coef[, 1]
						)
					}
					`}
				</Code>
			</div>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-6xl">モチベーション</h2>
			<div class="mt-4">
				<Code lang="r" lines="5-7">
					{`
					#' @param x Design matrix.
					#' @param y Response vector.
					#' @param lambda Regularization parameter.
					my_lm_impl <- function(x, y, lambda) {
						lambda_i <- diag(lambda, ncol(x))
						coef <-
							qr.solve(t(x) %*% x + lambda_i) %*% t(x) %*% y
						tibble::tibble(
							term = colnames(x),
							estimate = coef[, 1]
						)
					}
					`}
				</Code>
			</div>
			<p class="mt-4 text-5xl">
				ここで
				<a class="text-green-300" href="https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%83%E3%82%B8%E5%9B%9E%E5%B8%B0" target="_blank" rel="noreferrer">リッジ回帰</a>
				をしている関数
			</p>
			<Step>
				{`
					\\[ \\beta = (X^T X + \\lambda I)^{-1} X^T \\boldsymbol{y} \\]
				`}
			</Step>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">実装のポイント</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">実装のポイント</h2>
			<ul class="mt-12 pl-8 list-decimal text-left">
				<Step>
					<li class="m-4 text-5xl">引数を<span class="text-blue-300">formula</span>,
					<span class="text-blue-300">data</span>の形にしたい</li>
				</Step>
				<Step>
					<li class="m-4 text-5xl"><span class="text-blue-300">lambda</span>をtidymodelsで調整可能にしたい</li>
				</Step>
			</ul>
			<Step>
				<ul class="mt-12 pl-8 list-decimal text-left">
					<li class="m-4 text-5xl"> ->ラッパーを書けばできそう</li>
					<li class="m-4 text-5xl"> ->それをさらにラップする</li>
				</ul>
			</Step>
		</Slide>
	</Vertical>
</Presentation>
