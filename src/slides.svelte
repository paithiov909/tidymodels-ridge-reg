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

	<Vertical>
		<Slide>
			<h1 class="font-bold text-8xl">
				tidymodelsに<br />
				リッジ回帰を<br />
				実装しよう
			</h1>
		</Slide>
		<Slide>
			<h3 class="font-bold text-6xl">アジェンダ</h3>
			<div class="mt-12 pl-8 flex flex-row">
			<ul class="basis-1/2 list-disc text-left">
				<li>モチベーション</li>
				<li>実装のポイント</li>
				<li>ひな形をつくる</li>
				<li>テストを書く</li>
				<li>関数を実装する</li>
				<li>テストしてみる</li>
				<li>やってみよう</li>
			</ul>
			<ul class="basis-1/2 list-disc text-left">
				<li>tidymodelsで使う</li>
				<li>エンジンの追加</li>
				<li>predictを実装する</li>
				<li>試してみよう</li>
				<li>まとめ</li>
			</ul>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">モチベーション</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-6xl">モチベーション</h2>
			<p class="mt-4 text-4xl">
				こういう関数を
				<a
					class="text-green-300"
					href="https://parsnip.tidymodels.org/"
					target="_blank"
					rel="noreferrer"
				>parsnip</a>
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
				<a
					class="text-green-300"
					href="https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%83%E3%82%B8%E5%9B%9E%E5%B8%B0"
					target="_blank"
					rel="noreferrer"
				>リッジ回帰</a>
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
		<Slide animate>
			<h2 class="font-bold text-8xl">やってみよう</h2>
			<p class="mt-12 text-4xl">
				このテストもこのままでは通らない。修正が必要
			</p>
			<div class="mt-4">
				<Code lang="r">
					{`
					dat <- iris |>
						dplyr::mutate(
							dplyr::across(dplyr::where(is.numeric),
							~ scale(.)))
					expected <-
						MASS::lm.ridge(
							Petal.Width ~ ., data = dat[, 1:4], lambda = 0.5) |>
						broom::tidy() |>
						dplyr::select("term", "estimate")
					actual <-
						lm_ridge_glmnet(
							Petal.Width ~ ., data = dat[, 1:4], lambda = 0.5) |>
						dplyr::filter(term != "(Intercept)") |>
						dplyr::select("term", "estimate")
					expect_equal(actual, expected, tolerance = 1e-2)
					`}
				</Code>
			</div>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">tidymodelsで使う</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">tidymodelsで使う</h2>
			<p class="mt-12 text-4xl text-left">
				<span class="text-blue-300">oreoridge::lm_ridge()</span>をtidymodelsで使えるようにしたい
			</p>
			<p class="mt-4 text-4xl text-left">
				Rパッケージの関数をtidymodelsで使えるようにするには、新規にタイプを作成する方法と、既存のタイプにエンジンを追加する方法がある。
			</p>
			<p class="mt-4 text-4xl text-left">
				ここでは<span class="text-blue-300">parsnip::linear_reg()</span>にエンジンを追加することによって使えるようにする
			</p>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">tidymodelsで使う</h2>
			<p class="mt-12 text-4xl">
				parsnipのモデルは
				<a
					class="text-green-300"
					href="https://parsnip.tidymodels.org/index.html#getting-started"
					target="_blank"
					rel="noreferrer"
				>タイプ・モード・エンジン</a>
				の<br />
				3つの組み合わせで構成されている
			</p>
			<ul class="mt-4 pl-8 list-disc text-left">
				<li>タイプ -><span class="text-blue-300">parsnip::linear_reg()</span>など</li>
				<li>モード ->classification, regressionなど</li>
				<li>エンジン ->lm, glmnetなど</li>
			</ul>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">エンジンの追加</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">エンジンの追加</h2>
			<p class="mt-12 text-4xl">
				<span class="text-blue-300">add_linear_reg_oreoridge</span>関数を定義して、<br />
				そのなかに
				<a
					class="text-green-300"
					href="https://parsnip.tidymodels.org/reference/set_new_model.html"
					target="_blank"
					rel="noreferrer"
				>必要な記述</a>
				を書いていく
			</p>
			<div class="mt-4">
				<Code lang="r">
					{`
					parsnip::set_model_engine(
						"linear_reg", "regression", "oreoridge"
					)
					parsnip::set_dependency(
						"linear_reg", "oreoridge", "oreoridge"
					)
					`}
				</Code>
			</div>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">エンジンの追加</h2>
			<div class="mt-12">
				<Code lang="r">
					{`
					parsnip::set_fit(
						model = "linear_reg",
						eng = "oreoridge",
						mode = "regression",
						value = list(
							interface = "formula",
							protect = c("formula", "data"),
							func = c(pkg = "oreoridge", fun = "lm_ridge"),
							defaults = list()
						)
					)
					`}
				</Code>
			</div>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">エンジンの追加</h2>
			<div class="mt-12">
				<Code lang="r">
					{`
					parsnip::set_model_arg(
						model = "linear_reg",
						eng = "oreoridge",
						parsnip = "penalty",
						original = "lambda",
						func = list(pkg = "dials", fun = "penalty"),
						has_submodel = FALSE
					)
					`}
				</Code>
			</div>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">エンジンの追加</h2>
			<div class="mt-12">
				<Code lang="r">
					{`
					parsnip::set_encoding(
						model = "linear_reg",
						eng = "oreoridge",
						mode = "regression",
						options = list(
							predictor_indicators = "none",
							compute_intercept = FALSE,
							remove_intercept = FALSE,
							allow_sparse_x = FALSE
						)
					)
					`}
				</Code>
			</div>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">エンジンの追加</h2>
			<div class="mt-12">
				<Code lang="r">
					{`
					parsnip::set_pred(
						model = "linear_reg",
						eng = "oreoridge",
						mode = "regression",
						type = "numeric",
						value = list(
							pre = NULL,
							post = NULL,
							func = c(fun = "predict"),
							args =
								list(
									object = rlang::expr(object$fit), # nolint
									new_data = rlang::expr(new_data) # nolint
								)
						)
					)
					`}
				</Code>
			</div>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">エンジンの追加</h2>
			<ul class="mt-12 pl-8 list-disc text-left">
				<li>
					<span class="text-blue-300">.onLoad()</span>のなかに先ほどの関数の呼び出しを追加
				</li>
				<li>DESCRIPTIONのImportsにrlangを追加</li>
				<li>DESCRIPTIONのDependsにparsnipを追加</li>
				<li><span class="text-blue-300">devtools::document()</span>する</li>
			</ul>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">predictを実装する</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">predictを実装する</h2>
			<ul class="mt-12 pl-8 list-disc text-left">
				<li>
					先ほどの関数は、<span class="text-blue-300">lm_ridge()</span>の戻り値を使って後から<span class="text-blue-300">predict()</span>できるような記述をした
				</li>
				<li>
					実際にはまだ<span class="text-blue-300">predict()</span>を実装していなかったため、新たに実装する必要がある
				</li>
				<li>
					本来はテストもあわせて書きたいが、簡単に実装できるようにするために、ここでは省略する
				</li>
			</ul>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">predictを実装する</h2>
			<p class="mt-12 text-4xl">
				まず
				<span class="text-blue-300">lm_ridge()</span>を次のように修正
			</p>
			<div class="mt-4">
				<Code lang="r">
					{`
					#' @export
					lm_ridge <- function(formula, data, lambda = 0) {
						x <- model.matrix(formula, data)
						y <- model.frame(formula, data) |>
							model.response("numeric")
						out <- lm_ridge_impl(x, y, lambda)
						class(out) <- c("oreoridge", class(out))
						out
					}
					`}
				</Code>
			</div>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">predictを実装する</h2>
			<p class="mt-12 text-4xl">
				次に<span class="text-blue-300">predict.oreoridge()</span>を次のように書き、<br />
				<span class="text-blue-300">devtools::document()</span>する
			</p>
			<div class="mt-4">
				<Code lang="r">
					{`
					#' @export predict.oreoridge
					#' @export
					predict.oreoridge <- function(object, new_data, ...) {
						new_data <-
							tibble::tibble(
								intercept = rep(1, nrow(new_data)),
								new_data[, tail(object[["term"]], -1)]
							) |>
							as.matrix()
						pred <- new_data %*% object[["estimate"]]
						tibble::tibble(
							.pred = pred[, 1]
						)
					}
					`}
				</Code>
			</div>
		</Slide>
	</Vertical>

	<Vertical>
		<Slide animate>
			<h2 class="font-bold text-8xl">試してみよう</h2>
		</Slide>
		<Slide animate>
			<h2 class="font-bold text-8xl">試してみよう</h2>
			<p class="mt-12 text-4xl">
				<span class="text-blue-300">parsnip::linear_reg()</span>から
				<span class="text-blue-300">lm_ridge()</span>を使ってみる
			</p>
			<Step>
				<div class="mt-4">
					<Code lang="r">
						{`
						library(tidymodels)
						devtools::load_all(export_all = FALSE)

						spec <-
							linear_reg(penalty = tune()) |>
							set_engine("oreoridge") |>
							set_mode("regression")

						translate(spec)
						`}
					</Code>
				</div>
			</Step>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">試してみよう</h2>
			<div class="mt-12">
				<Code lang="r">
					{`
					data("penguins", package = "modeldata")

					data_split <- penguins |>
						dplyr::select(dplyr::where(is.numeric)) |>
						initial_split(strata = body_mass_g)
					penguins_train <- training(data_split)
					penguins_test <- testing(data_split)

					rec <-
						recipe(
							body_mass_g ~ .,
							data = penguins_train
						) |>
						step_impute_median(all_numeric()) |>
						step_scale(all_numeric())
					`}
				</Code>
			</div>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">試してみよう</h2>
			<div class="mt-12">
				<Code lang="r">
					{`
					grid <-
						workflow() |>
						add_recipe(rec) |>
						add_model(spec) |>
						tune_grid(
							resamples = vfold_cv(
								penguins_train,
								v = 3,
								strata = body_mass_g
							),
							grid = 5,
							control = control_grid(verbose = TRUE)
						)
					`}
				</Code>
			</div>
		</Slide>
		<Slide>
			<h2 class="font-bold text-8xl">試してみよう</h2>
			<div class="mt-12">
				<Code lang="r">
					{`
					best_fit <-
						workflow() |>
						add_recipe(rec) |>
						add_model(spec) |>
						finalize_workflow(select_best(grid, metric = "rmse"))

					last_fit(best_fit, data_split) |>
						collect_metrics()
					`}
				</Code>
			</div>
		</Slide>
	</Vertical>

	<Slide animate>
		<h2 class="font-bold text-8xl">まとめ</h2>
		<Step>
			<p class="mt-12 text-4xl text-left">
				tidymodelsでリッジ回帰するためのRパッケージを書き、とりあえず動くところまで実装できた
			</p>
		</Step>
		<Step>
			<p class="mt-4 text-4xl text-left">
				リッジ回帰の実装として実用することを意図したものではないが、同様のやり方でtidymodelsにエンジンを追加することができるはず
			</p>
		</Step>
		<Step>
			<p class="mt-4 text-4xl text-left">
				-> tidymodelsで使いたい実装があったら、Rパッケージをつくってエンジンを追加してみよう
			</p>
		</Step>
	</Slide>
</Presentation>
