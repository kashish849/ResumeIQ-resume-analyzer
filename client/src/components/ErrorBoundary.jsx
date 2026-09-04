import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ResumeIQ crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something broke on this page</h1>
          <p style={{ color: '#6B7280', marginBottom: 16, maxWidth: 480 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/dashboard'; }}
            style={{ padding: '10px 20px', borderRadius: 8, background: '#5B4FE9', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}
          >
            Back to dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
