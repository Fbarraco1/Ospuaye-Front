import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/white-logo1.svg";
import logoSSS from "../../../assets/images/logo/sss.svg";


export const Footer = () => {
    
  const navigate = useNavigate();

return (  
  // Start Footer Area
  <footer className="footer overlay">
    {/* Start Footer Middle */}
    <div className="footer-middle">
      <div className="container">
        <div className="row">
          {/* Columna 1 */}
          <div className="col-lg-3 col-md-6 col-12">
            <div className="single-footer f-about">
              <div className="logo">
                <span onClick={() => navigate("/")}>
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "auto", height: "auto" }}
                  />
                </span>
              </div>
              <ul className="social">
                <li>
                  <p className="copyright-text">RNOS-1-2510-3</p>
                </li>
                <li>
                  <p className="copyright-text">
                    OBRA SOCIAL DE LOS PROFESIONALES UNIVERSITARIOS DEL AGUA Y LA ENERGÍA ELÉCTRICA
                  </p>
                </li>
              </ul>
            </div>
          </div>
          {/* Columna 2 */}
          <div className="col-lg-3 col-md-6 col-12">
            <div className="single-footer f-about">
              <h3>Redes Sociales</h3>
              <ul className="social">
                <li>
                  <a href="paginaConstruccion.html">
                    <i className="lni lni-facebook-filled"></i>
                  </a>
                </li>
                <li>
                  <a href="paginaConstruccion.html">
                    <i className="lni lni-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="paginaConstruccion.html">
                    <i className="lni lni-linkedin-original"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Columna 3 */}
          <div className="col-lg-3 col-md-6 col-12">
            <div className="single-footer opening-hours">
              <h3>CONTACTO</h3>
              <ul>
                <li>
                  <i className="lni lni-map-marker"></i>
                  <a
                    style={{ color: "white", textDecoration: "none" }}
                    href="https://www.google.com/maps?q=-34.59550286802829,-58.373222215538824"
                  >
                    {" "}
                    Reconquista 1048, 2do. Piso, CABA, Buenos Aires, Argentina
                  </a>
                </li>
                <li>
                  <i className="lni lni-phone"></i>
                  <a
                    style={{ color: "white", textDecoration: "none" }}
                    href="tel:08007770238"
                  >
                    {" "}
                    0800-777-0238 (Línea Gratuita)
                  </a>
                </li>
                <li>
                  <i className="lni lni-phone"></i>
                  <a
                    style={{ color: "white", textDecoration: "none" }}
                    href="tel:01143121111"
                  >
                    {" "}
                    + 54 011 4312 1111 (int. 120, 122, 126)
                  </a>
                </li>
                <li>
                  <i className="lni lni-envelope"></i>
                  <a
                    style={{ color: "white", textDecoration: "none" }}
                    href="mailto:ospuaye@ospuaye.org.ar"
                  >
                    {" "}
                    ospuaye@ospuaye.org.ar
                  </a>
                </li>
                <li>
                  <i className="lni lni-whatsapp"></i>
                  <a
                    style={{ color: "white", textDecoration: "none" }}
                    href="https://wa.me/5491141875753"
                  >
                    {" "}
                    +54 9 1141875753
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Columna 4 */}
          <div className="col-lg-3 col-md-6 col-12">
            <div className="single-footer last f-contact">
              <div className="logo">
                <a href="https://www.argentina.gob.ar/sssalud">
                  <img
                    src={logoSSS}
                    alt="Logo"
                    width={250}
                    height={70}
                  />
                </a>
              </div>
              <br />
              <ul>
                <li>
                  <i className="lni lni-map-marker"></i> Bartolomé Mitre 434 – Cód. Postal 1035 - CAP. FED.
                </li>
                <li>
                  <i className="lni lni-phone"></i> 0800-222-SALUD(72583)
                </li>
                <li>
                  <i className="lni lni-website"></i> www.sssalud.gob.ar
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/*/ End Footer Middle */}

    {/* Start Footer Bottom */}
    <div className="footer-bottom">
      <div className="container">
        <div className="inner">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="content">
                <p className="copyright-text">
                  © Copyright 2025. Todos los derechos reservados OSPUAYE
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12"></div>
          </div>
        </div>
      </div>
    </div>
    {/* End Footer Bottom */}
  </footer>
)
};