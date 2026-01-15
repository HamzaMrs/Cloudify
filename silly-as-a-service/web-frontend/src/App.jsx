import React, { useState, useEffect } from 'react';

function App() {
    const [sillyContent, setSillyContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // URL de l'API Gateway (accessible depuis le navigateur via le port exposé)
    const API_URL = 'http://localhost:3000';

    const generateSillyContent = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/generate`);
            const data = await response.json();
            setSillyContent(data.silly_content || 'Contenu absurde non disponible');
        } catch (error) {
            console.error('Error:', error);
            setSillyContent('Erreur lors de la génération du contenu');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            setMessage(response.ok ? 'Inscription réussie!' : 'Erreur lors de l\'inscription');
        } catch (error) {
            setMessage('Erreur de connexion');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            setMessage(response.ok ? 'Connexion réussie!' : 'Identifiants incorrects');
        } catch (error) {
            setMessage('Erreur de connexion');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#333', textAlign: 'center' }}>🎭 Silly as a Service</h1>
            <p style={{ textAlign: 'center', color: '#666' }}>
                La plateforme la plus absurde du web! Architecture microservices avec Docker.
            </p>

            <div style={{ marginTop: '40px', padding: '20px', border: '2px solid #ddd', borderRadius: '8px' }}>
                <h2>✨ Générateur de Contenu Absurde</h2>
                <button 
                    onClick={generateSillyContent} 
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Génération...' : 'Générer du contenu absurde'}
                </button>
                {sillyContent && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                        <strong>Résultat:</strong> {sillyContent}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '40px', padding: '20px', border: '2px solid #ddd', borderRadius: '8px' }}>
                <h2>👤 Authentification</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={handleRegister}
                            type="button"
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            S'inscrire
                        </button>
                        <button 
                            onClick={handleLogin}
                            type="button"
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: '#FF9800',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Se connecter
                        </button>
                    </div>
                </form>
                {message && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                        {message}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h3>🏗️ Architecture Microservices</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li><strong>Frontend (Tier 1):</strong> React + Nginx (Port 80)</li>
                    <li><strong>API Gateway (Tier 2):</strong> Express.js (Port 3000)</li>
                    <li><strong>User Service (Tier 3):</strong> Go + MySQL</li>
                    <li><strong>Silly Generator (Tier 3):</strong> Python Flask</li>
                    <li><strong>Database (Tier 4):</strong> MySQL 8.0 avec volumes persistants</li>
                </ul>
            </div>
        </div>
    );
}

export default App;