import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate();
    const token = localStorage.getItem('@Projeto:token');

    const lidarComLogout = () =>{
        localStorage.removeItem('@Projeto:token');
        navigate('/login');
    };

    if(!token){
        return(
            <>
                <h2>Ola</h2>
                <p>Você não esta logado</p>
                <button onClick={() => navigate('/login')}>Fazer login</button>
                <button onClick={() => navigate('/register')}>Registrar</button>
            </>
        );
    }

    return(
        <>
            <h1>Bem-vindooo</h1>
            <p> Esta área e protegida </p>
            <button onClick={lidarComLogout}>Sair</button>
        </>
    );
}

export default Home;