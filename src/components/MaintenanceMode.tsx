const message = 'azul! salam! azul! salam!azul! salam!azul! salam!azul! salam!azul! salam!azul! salam!azul! salam! ';

export default function MaintenanceMode() {
  return <main className="maintenance-screen"><p>{Array.from({ length: 18 }, () => message).join('')}</p></main>;
}
