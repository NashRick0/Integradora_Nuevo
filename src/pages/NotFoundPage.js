import { Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <h1 style={{ fontSize: '3rem' }}>404</h1>
        <p>Página no encontrada</p>
        <Link to="/login">
            <Button type="primary">Volver al inicio</Button>
        </Link>
        </div>
    );
};

export default NotFoundPage;
