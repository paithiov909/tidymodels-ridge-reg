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
			使ってみよう
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
					lm_ridge_impl <- function(x, y, lambda) {
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
					lm_ridge_impl <- function(x, y, lambda) {
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
					<li class="m-4 text-5xl"> ->それをさらにラップすればいい</li>
				</ul>
			</Step>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">ひな形をつくる</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">ひな形をつくる</h2>
			<p class="mt-12 text-4xl">
				とりあえず、Rパッケージのひな形をつくる
			</p>
			<div class="mt-4">
				<Code lang="r">
					{`
						usethis::create_tidy_package("oreoridge")
						setwd("oreoridge")
						here::i_am() # 作業ディレクトリの確認
					`}
				</Code>
			</div>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">テストを書く</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">テストを書く</h2>
			<p class="mt-12 text-4xl text-left">
				はじめに、実装したい関数に対応するテストを書いてみる
			</p>
			<p class="mt-4 text-4xl text-left">
				先にテストを書いてからそれをパスするような関数を実装するやり方をすると、
				どんな使い方をする関数を書けばよいかイメージしやすい
			</p>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">テストを書く</h2>
			<ul class="mt-12 pl-8 list-disc text-left">
				<li>以下の内容のテストをつくる</li>
				<li>DESCRIPTIONのSuggestsにbroom, dplyr, MASSを追加</li>
				<li>テストを実行してみる</li>
			</ul>
			<div class="mt-4">
				<Code lang="r">
					{`
						dat <- iris |>
							dplyr::mutate(
								dplyr::across(dplyr::where(is.numeric),
								~ scale(.))
							)
						expected <-
							MASS::lm.ridge(
								Petal.Width ~ ., dat[, 1:4], lambda = .5) |>
							broom::tidy() |>
							dplyr::select("term", "estimate")
						actual <-
							lm_ridge(
								Petal.Width ~., data = dat[, 1:4], lambda = .5)
						expect_equal(actual, expected, tolerance = 1e-2)
					`}
				</Code>
			</div>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">関数を実装する</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">関数を実装する</h2>
			<ul class="mt-12 pl-8 list-disc text-left">
				<li>次の内容をコピペ、roxygenコメントを書く</li>
				<li>DESCRIPTIONのImportsにstats, tibbleを追加</li>
				<li><span class="text-blue-300">devtools::document()</span>する</li>
			</ul>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">関数を実装する</h2>
				<div class="mt-12">
					<Code lang="r">
						{`
							lm_ridge_impl <- function(x, y, lambda) {
								lambda_i <- diag(lambda, ncol(x))
								coef <-
									qr.solve(t(x) %*% x + lambda_i) %*% t(x) %*% y
								tibble::tibble(
									term = colnames(x),
									estimate = coef[, 1]
									)
								}
							#' @import stats
							lm_ridge <- function(formula, data, lambda = 0) {
								x <- model.matrix(formula, data)
								y <- model.frame(formula, data) |>
									model.response("numeric")
								lm_ridge_impl(x, y, lambda)
							}
						`}
					</Code>
				</div>
			</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">テストしてみる</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">テストしてみる</h2>
			<ul class="mt-12 pl-8 list-disc text-left">
				<li>actualには<span class="text-blue-300">(Intercept)</span>の行があるので通らないはず</li>
				<li>ここではテストの側を修正する</li>
			</ul>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">やってみよう</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">やってみよう</h2>
			<p class="mt-12 text-4xl text-left">
				<span class="text-blue-300">glmnet::glmnet()</span>のラッパーを追加してみよう
			</p>
			<ul class="mt-4 pl-8 list-disc text-left">
				<li>テストを書く</li>
				<li>関数を実装する</li>
				<li>テストしてみる</li>
			</ul>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">やってみよう</h2>
			<p class="mt-12 text-4xl text-left">
				<span class="text-blue-300">glmnet::glmnet()</span>のラッパーを追加してみよう
			</p>
			<div class="mt-4">
				<Code lang="r">
					{`
						# TODO: エクスポートする
						lm_ridge_glmnet <- function(formula, data, lambda) {
							x <- model.matrix(formula, data)
							y <- model.frame(formula, data) |>
								model.response("numeric")
							out <- glmnet::glmnet(
								x, y,
								alpha = 0,
								lambda = lambda / nrow(x)
							) |>
								broom::tidy()
							out
						}
					`}
				</Code>
			</div>
		</Slide>
	</Vertical>

</Presentation>
