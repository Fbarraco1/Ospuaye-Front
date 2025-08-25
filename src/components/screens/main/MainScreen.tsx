import hero1 from '../../../assets/images/hero/01.svg'
import hero2 from '../../../assets/images/hero/05.svg'
import slider1 from '../../../assets/images/hero/atencion_03.png'
import slider2 from '../../../assets/images/hero/medico_13.png'
import slider3 from '../../../assets/images/logo/apuaye_logo.svg'
import slider4 from '../../../assets/images/hero/canales.png'
import slider5 from '../../../assets/images/hero/receta_electronica.png'
import about from '../../../assets/images/hero/about.png'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

export const MainScreen = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    renderMode: "precision",
    drag: true,
    slides: { perView: 1 },
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 1 } },
      "(min-width: 1200px)": { slides: { perView: 1 } },
    },
  })

  return (
    <>
      {/* Hero Area */}
      <section className="hero-area">
        <div className="shapes">
          <img src={hero2} className="shape1" alt="#" />
          <img src={hero1} className="shape2" alt="#" />
        </div>

        {/* Hero Slider */}
        <div ref={sliderRef} className="keen-slider hero-slider">
          {/* Slider 1 */}
          <div className="keen-slider__slide single-slider">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-text">
                    <div className="section-heading">
                      <h2>0800 LÍNEA GRATUITA</h2>
                      <p>
                        OSPUAYE pone a disposición de sus afiliados y afiliadas
                        la línea gratuita de atención 0800-777-0238, a través de
                        la cual podrán acceder a información detallada sobre los
                        servicios y prestaciones que brinda nuestra Obra Social.
                        Este canal de comunicación ha sido diseñado para ofrecer
                        respuestas claras, ágiles y precisas.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-image">
                    <img src={slider1} alt="#" width={1500} height={750} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="keen-slider__slide single-slider">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-text">
                    <div className="section-heading">
                      <h2>AFILIARTE</h2>
                      <p>
                        ¿Sabías que ser parte de nuestra obra social implica
                        mucho más que acceder a servicios médicos? Es integrarse
                        a una red que protege a cada trabajador y su familia,
                        brindando atención con compromiso, cercanía y excelencia.
                      </p>
                      <div className="button">
                        <a href="afiliarte.html" className="btn">
                          CONOCER MÁS
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-image">
                    <img src={slider2} alt="#" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider 3 */}
          <div className="keen-slider__slide single-slider">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-text">
                    <div className="section-heading">
                      <h2>
                        ASOCIACIÓN DE PROFESIONALES UNIVERSITARIOS DEL AGUA Y LA
                        ENERGÍA
                      </h2>
                      <p>
                        Conocer el estrecho vínculo que une a OSPUAYE con APUAYE
                        permite saber los orígenes de nuestra Obra Social. Juntos
                        formamos parte de un mismo ecosistema diseñado para
                        proteger y potenciar el bienestar de los profesionales
                        del sector.
                      </p>
                      <div className="button">
                        <a href="contactoAsesor.html" className="btn">
                          CONOCER MÁS
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-image">
                    <img src={slider3} alt="#" width={1100} height={650} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider 4 */}
          <div className="keen-slider__slide single-slider">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-text">
                    <div className="section-heading">
                      <h2>CANALES DE ATENCIÓN</h2>
                      <p>
                        En OSPUAYE trabajamos con el compromiso de ofrecer una
                        atención cercana, clara y eficiente. Por ello, es
                        esencial que conozca y utilice nuestros canales oficiales
                        de comunicación.
                      </p>
                      <div className="button">
                        <a href="contacto.html" className="btn">
                          CONOCER MÁS
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-image">
                    <img src={slider4} alt="#" width={1100} height={650} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider 5 */}
          <div className="keen-slider__slide single-slider">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-text">
                    <div className="section-heading">
                      <h2>RECETA ELECTRÓNICA</h2>
                      <p>
                        La receta electrónica en Argentina es ahora obligatoria
                        para todas las órdenes médicas, y su implementación está
                        respaldada por un marco legal y regulatorio actualizado
                        que busca modernizar el sistema de salud.
                      </p>
                      <div className="button">
                        <a href="recetaElectronica.html" className="btn">
                          CONOCER MÁS
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-12">
                  <div className="hero-image">
                    <img src={slider5} alt="#" width={1200} height={750} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Area */}
      <section className="about-us section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 col-12">
              <div
                className="content-left wow fadeInLeft"
                data-wow-delay=".3s"
              >
                <img src={about} alt="#" />
              </div>
            </div>

            <div className="col-lg-6 col-md-12 col-12">
              <div
                className="content-right wow fadeInRight"
                data-wow-delay=".5s"
              >
                <span className="sub-heading">SOBRE NOSOTROS</span>
                <h2>EL BIENESTAR DE NUESTROS AFILIADOS ES LA PRIORIDAD</h2>
                <p>
                  Somos una entidad sin fines de lucro, creada y gestionada por
                  y para los profesionales del agua y la energía, así como sus
                  familias. Nuestra misión principal es garantizar el acceso a
                  una cobertura de salud integral y de calidad.
                </p>
                <br />
                <p>
                  La salud es un derecho fundamental. En un contexto económico y
                  social complejo como el de Argentina, contar con una cobertura
                  de salud sólida se vuelve indispensable. Nuestra obra social
                  brinda esa tranquilidad, esa seguridad de saber que, ante
                  cualquier eventualidad, usted y su familia estarán protegidos.
                </p>
                <br />
                <p>
                  No somos solo una obra social, somos el resultado de la visión
                  y la solidaridad de nuestros profesionales. Somos un espacio
                  de encuentro, de apoyo mutuo y de protección, donde cada uno
                  de nosotros sabe que su bienestar y el de su familia son la
                  prioridad.
                </p>
                <div className="button">
                  <a href="sobreNosotros.html" className="btn">
                    CONOCER MÁS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="how-works">
      <div className="container-fluid">
        <div className="row">
          {/* Bloque 1 */}
          <div className="col-lg-4 col-md-4 col-12 p-0">
            <div className="single-work first">
              <div className="main-icon">
                <i className="lni lni-grow"></i>
              </div>
              <h3>Programa Médico Obligatorio (PMO)</h3>
              <p>
                El Programa Médico Obligatorio (PMO) en Argentina es una
                herramienta fundamental para garantizar el acceso equitativo a
                la salud. Es una canasta básica de prestaciones que todas las
                obras sociales y empresas de medicina prepaga deben cubrir, sin
                importar el plan que tengas contratado.
              </p>
              <div className="button wow fadeInLeft" data-wow-delay=".7s">
                <a href="programas.html" className="btn">
                  CONOCER MÁS
                </a>
              </div>
            </div>
          </div>

          {/* Bloque 2 */}
          <div className="col-lg-4 col-md-4 col-12 p-0">
            <div className="single-work middle">
              <div className="main-icon">
                <i className="lni lni-layers"></i>
              </div>
              <h3>Cartilla</h3>
              <p>
                En la sección referida a la Cartilla Médico Asistencial, los
                afiliados/as pueden acceder a los anexo I, II, III y IV. La
                cartilla médica es una guía que le permite al usuario y su grupo
                familiar acceder a todos los servicios que le ofrecen las Obras
                Sociales Nacionales, según las pautas básicas establecidas en la
                Resolución 2165/2021 - SSSALUD.
              </p>
              <div className="button wow fadeInLeft" data-wow-delay=".7s">
                <a href="cartilla.html" className="btn">
                  CONOCER MÁS
                </a>
              </div>
            </div>
          </div>

          {/* Bloque 3 */}
          <div className="col-lg-4 col-md-4 col-12 p-0">
            <div className="single-work last">
              <div className="main-icon">
                <i className="lni lni-revenue"></i>
              </div>
              <h3>Coseguros</h3>
              <p>
                Nuestros afiliados/as pueden informarse de lo política de
                COSEGUROS de OSPUAYE, además de lo detallado en la resolución
                1926/2024.
              </p>
              <div className="button wow fadeInLeft" data-wow-delay=".7s">
                <a href="coseguro.html" className="btn">
                  CONOCER MÁS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};
