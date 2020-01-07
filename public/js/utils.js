
export default class Utils {

    static mostrarBtnVerMas = () => {
        document.querySelector('.btnVerMas').style.display = 'block';
    }
    
    static esconderBotonVerMas = () => {
        document.querySelector('.btnVerMas').style.display = 'none';
    }

    static eventoScrollTop = () => {

        let wrapBtn =  document.querySelector('#wrap-btn-scrollTop');
        let btn = document.querySelector('.btn-scrollTop');

        window.onscroll = () => {
            if (window.scrollY >= 400) {
                wrapBtn.style.opacity = 1;
                btn.style.cursor = 'pointer';
            }
            else {
                wrapBtn.style.opacity = 0;
                btn.style.cursor = 'auto';
            }
        }

        btn.onclick = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    static eventoImagenScale = (contenedor, imagen) => {
        contenedor.onmouseover = () => {
            imagen.style.transform = 'scale(1.03)';
        }
        contenedor.onmouseleave =() => {
            imagen.style.transform = 'scale(1)';
        }
    }

}