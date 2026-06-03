export function PasswordHint() {
  return (
    <output className="password-hint">
      <p>
        A senha deve ter no mínimo <strong>6 caracteres</strong>, incluindo pelo menos{' '}
        <strong>um dígito</strong>, <strong>uma letra maiúscula</strong> e{' '}
        <strong>um caractere especial permitido</strong>.
      </p>
      <p>
        Caracteres especiais <strong>permitidos</strong>: @ # $ % &amp; * ! ? / \ | - _ + . =
        <br />
        Caracteres especiais <strong>não permitidos</strong>: ¨ {'{'} {'}'} [ ] ´ ` ~ ^ : ; &lt; &gt; , “ ‘ "
      </p>
    </output>
  );
}
