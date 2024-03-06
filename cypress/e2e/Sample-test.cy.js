describe('Email Form Validation Test in React App', () => {
  it('Displays an error message for invalid email input', () => {
    cy.visit('http://localhost:3000/'); //URLを開く。

    cy.get('#email')
      .type('exampleexample.com'); //idがemailの要素に、無効なメールアドレスを入れる。
    cy.get('form').submit(); //フォーム送信
    cy.get('span')
      .should('be.visible') //spanタブがあることを確認
      .and('contain', '無効なメールアドレスです');
  });

  it('Does not display an error message for valid email input', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#email')
      .type('example@example.com');
    cy.get('form').submit();
    cy.get('span') //エラー表示のspanタブがないことを確認
      .should('not.exist');
  });
});