import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error, info) {
    console.error("Erro capturado pelo ErrorBoundary:", error);
    console.error("Stack de componentes:", info.componentStack);

    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "red" }}>
          <h2>⚠️ Algo deu errado</h2>
          {/* <p>{this.state.error?.message}</p> */}
          <p>{this.state.error && this.state.error.message}</p>
        </div>
      );
    }

    // 🔹 Retorna os componentes filhos normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;
