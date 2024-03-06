import { render, screen } from '@testing-library/react';
import Home from './home';

//home.test.jsに書いた方がいいかも。

test('ログイン画面に必要なコンポーネントが存在するかどうか（入力フォーム、ラベル、ボタンなど）', () => {
  render(<Home />);

  // ラベルの検証
  expect(screen.getByLabelText(/email:/i)).toBeInTheDocument(); //大文字小文字を区別せずに「email」というテキストを持つボタンを検索、存在チェック。

  // メールアドレス入力フィールドの検証
  expect(screen.getByRole('textbox', { name: /email:/i })).toBeInTheDocument(); //大文字小文字を区別せずに「email」というテキストを持つボタンを検索、テキストボックスの存在チェック。

  // 送信ボタンの検証
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument(); //大文字小文字を区別せずに「submit」というテキストを持つボタンを検索、検索ボタンの存在チェック。
});
