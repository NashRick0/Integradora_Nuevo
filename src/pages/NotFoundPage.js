import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const NotFoundPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirige después de 4 segundos
        const timer = setTimeout(() => {
            navigate('/login');
        }, 1500);

        return () => clearTimeout(timer); // Limpieza si el componente se desmonta antes
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
            <div className='scale-up-ver-bottom '>
                <p style={{ fontSize: '10vh' }}>404</p>
                <br />
                <img src='./no-desu.png' alt='imagen' style={{height:'15vh', width:'15vh'}}></img>
                <img src='./logo-ujed.png' alt='imagen' style={{height:'40vh', width:'40vh'}} className='jello-horizontal'></img>
                <img src='./no-desu.png' alt='imagen' style={{height:'15vh', width:'15vh'}}></img>
                <p style={{ fontSize: '3vh' }}>Upss... parece que te perdiste</p>
                <p style={{ fontSize: '2vh' }}>Vamos a regresarte al incio... </p>
                <br/>
            </div>
        </div>
    );
};

export default NotFoundPage;
