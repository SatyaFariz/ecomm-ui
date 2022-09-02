import type { NextPage } from 'next'

const AppHeader: NextPage = () => {
  return (
    <div className="sticky h-[64px] top-0 flex items-center border-b border-slate-900/10">
        <img
            className="ml-4"
            src="https://werkidz.mygostore.com/_next/static/images/goStore-logo-64f7ac0ca37c2341f8ae739a75345580.svg"
            alt="app logo"
        />
    </div>
  )
}

export default AppHeader