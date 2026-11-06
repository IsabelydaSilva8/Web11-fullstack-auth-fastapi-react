import axios from 'axios';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './../../services/api';
import type { ErrorResponse } from './../../types/auth';

function Register(){
    const[email, setEmail] = useState<string>('');
    const[password, setPassword] = useState<string>('');
    const[mensagem, setMensagem] = useState<string>('');
    const[erro, setErro] = useState<string>('');
    const[loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const lidarComRegistro = async (e: FormEvent) => {
        e.preventDefault();
        setErro('');
        setMensagem('');
        setLoading(true);

        try{
            await api.post('/register', {
                email: email,
                password: password,
            });

            setMensagem('Conta criada com sucesso');

            setTimeout(() => {
                navigate('/');
            });

        } catch (err){
            if(axios.isAxiosError(err) && err.response){
                const dadosErro = err.response.data as ErrorResponse;
                setErro(dadosErro.detail || 'Erro ao realizar o cadastro.');
            } else{
                setErro('Não foi possível conectar ao servidor backend.');
            }
        } finally {
            setLoading(false);
        }
    };
    


    return(
        <div>
            <form onSubmit={lidarComRegistro}>
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
                {loading ? 'Cadastrando...' : 'Criando conta'}
            </button>
            </form>
            {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            <p>
                Já tem uma conta?
                <button onClick={() => navigate('/login')}>
                    Fazer login
                </button>
            </p>
        </div>
    );
}

export default Register;