
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

    static eventoMostrarMenu = () => {

        this.mostrar = true;
        const nav = document.querySelector('nav');
        const body = document.querySelector('body');

        document.querySelector('#icon').onclick = () => {
            if (window.innerWidth > 700) return;

            if (this.mostrar) {
                nav.style.transform = 'translateX(0%)';
                body.style.overflowY = 'hidden';
            }
            else {
                nav.style.transform = 'translateX(200%)';
                body.style.overflowY = 'auto';
            }

            this.mostrar = !this.mostrar;
        }

        this.eventWindowResetMenuStyles(nav, body);
    }

    static eventWindowResetMenuStyles = (nav, body) => {
        window.onresize = () => {
            if (window.innerWidth > 700) {
                nav.style.transform = 'translateX(0%)';
                body.style.overflowY = 'auto';  
            }
            else {
                this.mostrar = false;
            }
        }
    }

}