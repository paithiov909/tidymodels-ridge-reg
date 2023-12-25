
- `usethis::create_tidy_package("oreoridge")`
  - `setwd("oreoridge")`
  - `here::i_am()`
- testを書く
  - `usethis::use_test("lm_ridge")`
  - DESCRIPTIONのSuggestsにbroom, dplyr, MASSを追加
  - テストを実行してみる

```r
dat <- dplyr::mutate(iris, dplyr::across(dplyr::where(is.numeric), ~ scale(.)))
expected <-
  MASS::lm.ridge(Petal.Width ~ ., data = dat[, 1:4], lambda = 0.5) |>
  broom::tidy() |>
  dplyr::select("term", "estimate")

actual <-
  lm_ridge(Petal.Width ~., data = dat[, 1:4], lambda = 0.5)

expect_equal(actual, expected, tolerance = 1e-2)
```

- テストに対応するRの関数を書く `usethis::use_r("lm_ridge")`
  - コピペ
  - DESCRIPTIONのImportsにstats, tibbleを追加
  - roxygenコメントを書いて`devtools::document()`

```r
#' @import stats
NULL

lm_ridge_impl <- function(x, y, lambda) {
  lambda_i <- diag(lambda, ncol(x))
  coef <-
    qr.solve(t(x) %*% x + lambda_i) %*% t(x) %*% y
  tibble::tibble(
    term = colnames(x),
    estimate = coef[, 1]
  )
}
# TODO: エクスポートする
lm_ridge <- function(formula, data, lambda = 0) {
  x <- model.matrix(formula, data)
  y <- model.frame(formula, data) |>
    model.response("numeric")
  lm_ridge_impl(x, y, lambda)
}
```

- テストしてみる
  - actualには`(Intercept)`の行があるので通らないはず
  - ここではテストの側を修正する

- やってみよう
- `glmnet::glmnet()`のラッパーを追加してみる
  - テストを書く
  - Rファイルを追加
  - テストしてみる

```r
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
  # browser()
  out
}
```

## つづき（tidymodelsで使う）
