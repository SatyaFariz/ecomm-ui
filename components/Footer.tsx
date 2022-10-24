import type { NextPage } from 'next'
import { AiOutlineInstagram, AiFillFacebook } from 'react-icons/ai'
import styles from './Footer.module.css'

const payment_methods = [
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3-ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fwarehouse%2Fassets%2Fimages%2Fpayment-icon%2Fmandiri.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3-ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fwarehouse%2Fassets%2Fimages%2Fpayment-icon%2Fatm-bersama.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3-ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fwarehouse%2Fassets%2Fimages%2Fpayment-icon%2Fmaster-card.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3-ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fwarehouse%2Fassets%2Fimages%2Fpayment-icon%2Fvisa.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fbeauty_studio%2Fpayment-logo%2Fbri.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3-ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fwarehouse%2Fassets%2Fimages%2Fpayment-icon%2Falto.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3-ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fwarehouse%2Fassets%2Fimages%2Fpayment-icon%2Fatm-prima.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fbeauty_studio%2Fpayment-logo%2Fgopay.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fbeauty_studio%2Fpayment-logo%2Fbni.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fbeauty_studio%2Fpayment-logo%2Fbca.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fbeauty_studio%2Fpayment-logo%2Fmega.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3-ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fwarehouse%2Fassets%2Fimages%2Fpayment-icon%2Flink-aja.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fbeauty_studio%2Fpayment-logo%2Fovo.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fbeauty_studio%2Fpayment-logo%2Fqris.png&w=750&q=75",
    "https://studio.femaledaily.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fassets.femaledaily.com%2Fbeauty_studio%2Fpayment-logo%2Fsp.png&w=750&q=75"
]

const shipping_methods = [
    "https://kejorahq.com/wp-content/uploads/2021/06/sicepat-logo.png"
]

const socials = [
    {
        url: 'https://instagram.com',
        icon: <AiOutlineInstagram className={styles.icon}/>
    },
    {
        url: 'https://facebook.com',
        icon: <AiFillFacebook className={styles.icon}/>
    }
]

const Footer: NextPage = () => {
  return (
    <footer className={styles.footer}>
        <section className={styles.section}>
            <h6 className={styles.title}>Follow us</h6>
            <div className={styles.icons}>
                {socials.map(social =>
                    <a href={social.url} target="_blank" key={social.url} rel="noreferrer">
                        {social.icon}
                    </a>
                )}
            </div>
        </section>

        <section className={styles.section}>
            <h6 className={styles.title}>Payment methods</h6>
            <div className={styles.icons}>
                {payment_methods.map(method =>
                    <img className={styles.icon} src={method} alt="payment method" key={method}/>
                )}
            </div>
        </section>

        <section className={styles.section}>
            <h6 className={styles.title}>Shipping methods</h6>
            <div className={styles.icons}>
                {shipping_methods.map(method =>
                    <img className={styles.icon} src={method} alt="shipping method" key={method}/>
                )}
            </div>
        </section>

        <p className={styles.copyright}>Copyright @ {new Date().getFullYear()} - Market X. All Right Reserved</p>
    </footer>
  )
}

export default Footer