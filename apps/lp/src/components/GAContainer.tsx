import Script from "next/script";

export const GAContainer = () => {
  return (
    <div id="ga-container">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-EEHDXY4KZZ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-EEHDXY4KZZ');
        `}
      </Script>
    </div>
  );
};
