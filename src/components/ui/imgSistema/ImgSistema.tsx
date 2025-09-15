import fondoAdmin from "../../../assets/images/FondoAdmin.png"

export const ImgSistema = () => {
  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
                src={fondoAdmin}
                alt="admin"
                style={{
                    opacity: 0.5,
                    width: '750px',
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block'
                }}
            />
        </div>
    </div>
  )
}
