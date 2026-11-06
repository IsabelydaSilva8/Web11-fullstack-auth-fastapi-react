import axios from 'axios';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './../../services/api';
import type { ErrorResponse, LoginResponse } from './../../types/auth';

function Login(){
    const[email, setEmail] = useState<string>('');
    const[password, setPassword] = useState<string>('');
    const [mensagem, setMensagem] = useState<string>('');
    const[erro, setErro] = useState<string>('');
    const[loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const lidarComLogin = async (e: FormEvent) => {
        e.preventDefault();
        setErro('');
        setMensagem('');
        setLoading(true);

        try{
            const resposta = await api.post<LoginResponse>('/login',{
                email: email,
                password: password,
            });

            setMensagem(`${resposta.data.message}! Token gerado.`);
            console.log('Token recebido do backend:', resposta.data.token);

            localStorage.setItem('@Projeto:token', resposta.data.token);

            setTimeout(() => {
                navigate('/');
            });

        } catch (err){
            if(axios.isAxiosError(err) && err.response){
                const dadosErro = err.response.data as ErrorResponse;
                setErro(dadosErro.detail || 'Erro ao realizar login.');
            } else{
                setErro('Não foi possível conectar ao servidor backend.');
            }
        } finally {
            setLoading(false);
        }
    };
    


    return(
        <div>
            <form onSubmit={lidarComLogin}>
                <label>E-mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seuemail@exemplo.com"
                />
                <label>Senha</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Digite sua senha"
                />
                <button type="submit" disabled={loading}>
                {loading ? 'Verificando...' : 'Entrar'}
            </button>
            </form>
            {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
        </div>
    );
}

export default Login;

 
