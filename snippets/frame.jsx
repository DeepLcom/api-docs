export const PrettyFrame = ({ children }) => {
  return (
    <section 
      className="mint-mx-auto mint-w-full mint-p-4 sm:mint-p-6 lg:mint-p-8 mint-rounded-2xl mint-border border-[rgba(228,227,212,0.30)] mint-bg-[#E4E3D4] mint-flex mint-flex-col lg:mint-flex-row mint-gap-4 sm:mint-gap-6 lg:mint-gap-8 not-prose"
    >
      {children}
    </section>
  )
}