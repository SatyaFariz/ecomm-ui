import Head from 'next/head'

const HtmlHead = (props: any) => {
  return (
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {props.children}
    </Head>
  )
}

export default HtmlHead