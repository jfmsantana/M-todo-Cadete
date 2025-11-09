export default function ErrorMsg({ error }) {
  if (!error) return null;
  return <p style={{ color: "crimson" }}>Erro: {String(error.message || error)}</p>;
}