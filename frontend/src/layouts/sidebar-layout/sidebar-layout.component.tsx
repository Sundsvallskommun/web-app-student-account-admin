import React from 'react';
import Head from 'next/head';
import { Link, CookieConsent, Header, Footer } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useRef } from 'react';
interface ISidebarLayout {
  title;
  children;
}

export default function SidebarLayout({ title, children }: ISidebarLayout) {
  const initialFocus = useRef(null);

  const setInitialFocus = () => {
    setTimeout(() => {
      initialFocus.current && initialFocus.current.focus();
    });
  };

  return (
    <div className="SidebarLayout full-page-layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Masterdata" />
      </Head>

      <NextLink legacyBehavior={true} href="#content" passHref>
        <a onClick={setInitialFocus} accessKey="s" className="next-link-a">
          Hoppa till innehåll
        </a>
      </NextLink>

      <Header
        title={`Masterdata`}
        // logoLinkOnClick={handleLogoClick}
        LogoLinkWrapperComponent={<NextLink legacyBehavior={true} href={'/'} passHref />}
      />

      <div className="main-container flex-grow">
        <div className="container relative">
          {/* <Sidebar /> */}
          <main className="bg-white overflow-y-visible">
            <div className="relative overflow-y-scroll">{children}</div>
          </main>
        </div>
      </div>

      <CookieConsent
        title="Kakor på Kontohantering"
        body={
          <p>
            Vi använder kakor, cookies, för att ge dig en förbättrad upplevelse, sammanställa statistik och för att viss
            nödvändig funktionalitet ska fungera på webbplatsen.{' '}
            <NextLink href="/kakor" passHref>
              <Link>Läs mer om hur vi använder kakor</Link>
            </NextLink>
          </p>
        }
        cookies={[
          {
            optional: false,
            displayName: 'Nödvändiga kakor',
            description:
              'Dessa kakor är nödvändiga för att webbplatsen ska fungera och kan inte stängas av i våra system.',
            cookieName: 'necessary',
          },
          {
            optional: true,
            displayName: 'Funktionella kakor',
            description: ' Dessa kakor ger förbättrade funktioner på webbplatsen.',
            cookieName: 'func',
          },
          {
            optional: true,
            displayName: 'Kakor för statistik',
            description:
              'Dessa kakor tillåter oss att räkna besök och trafikkällor, så att vi kan mäta och förbättra prestanda på vår webbplats.',
            cookieName: 'stats',
          },
        ]}
        resetConsentOnInit={false}
        onConsent={() => {
          // FIXME: do stuff with cookies?
          // NO ANO FUNCTIONS
        }}
      />

      <Footer color="gray">
        <div className="flex justify-between gap-16 md:gap-32">
          <svg
            focusable="false"
            aria-label="Sundsvalls Kommun logotyp"
            role="img"
            width="111"
            height="44"
            viewBox="0 0 111 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.16832 4.27882C5.16832 4.27882 4.18609 5.99435 5.92786 6.47563C8.14683 7.01513 10.5249 7.36057 12.7518 8.23386C13.3761 8.45897 12.6921 9.03341 12.2786 9.01012C8.43712 7.97769 4.76668 6.68134 0.348633 6.86764C1.33086 8.03203 2.79427 9.6156 3.13228 11.1992C4.67124 9.99597 7.05723 9.33227 8.93818 10.3065L6.72319 11.0672C3.20386 12.3442 0.82583 15.977 0.459979 19.443C0.129918 23.3243 2.26935 26.6933 5.73301 28.4671C9.92439 30.6251 16.629 29.7091 18.5338 34.0561C18.9911 35.1002 18.9553 37.1612 18.0646 38.3954C16.4739 40.3749 14.2152 40.9609 11.5508 40.666C11.5508 40.666 8.42519 40.2468 6.56412 38.865C3.90773 36.8817 3.14421 34.2541 2.78234 31.3082H1.19168C1.55356 35.0187 1.19168 38.7719 0.646881 42.3155L2.00292 42.4514C2.20329 41.9271 2.45219 41.4217 2.74655 40.9415C2.90503 40.7837 3.11527 40.6852 3.34057 40.6632C3.56588 40.6412 3.79194 40.6971 3.97931 40.8212C8.6797 43.9728 16.3069 43.9495 20.713 41.0463C23.7472 38.8651 24.8328 35.5582 23.946 32.1194C21.9338 25.2378 13.8255 26.0141 8.54449 23.6193C6.79079 22.9401 5.01323 21.2905 4.99733 19.2645C4.95539 18.29 5.17292 17.3216 5.62872 16.4536C6.08452 15.5856 6.76303 14.8477 7.59805 14.312C8.05627 14.0372 8.57351 13.8698 9.10917 13.8229C7.67758 15.2706 6.79477 16.928 7.0453 19.0355C7.2322 20.7394 8.7473 22.3851 10.4135 22.8741C12.0797 23.3632 13.5232 22.6723 14.7481 21.7524L14.6049 21.0266C13.8353 21.209 13.0322 21.209 12.2627 21.0266C10.7913 20.5143 10.2505 19.1054 10.3737 17.6654C10.39 17.5159 10.4403 17.3717 10.5207 17.2435C10.6012 17.1152 10.7099 17.0061 10.839 16.924C10.9681 16.8418 11.1143 16.7888 11.267 16.7687C11.4197 16.7485 11.5751 16.7619 11.7218 16.8076C15.3167 18.2787 14.6765 22.9789 18.0845 24.6285C18.5717 24.79 19.0918 24.8338 19.6002 24.7561C20.1086 24.6783 20.59 24.4814 21.0033 24.1821C22.7888 22.9479 23.4251 21.3294 23.9222 19.3732C22.9598 20.4328 22.085 21.5661 20.6693 21.8262C19.9614 21.9814 19.5956 21.8262 19.178 21.2284C17.7822 19.0588 17.3408 15.4337 14.0561 15.1076C13.3904 15.0788 12.7234 15.1231 12.0678 15.2396C12.9029 14.5759 13.909 13.92 15.0304 13.9006C15.8231 13.9088 16.6013 14.1088 17.2953 14.4827C17.9894 14.8566 18.5775 15.3927 19.007 16.043C19.163 16.3933 19.224 16.7768 19.1843 17.1568C19.1446 17.5367 19.0055 17.9003 18.7804 18.2127L19.532 18.7638C20.7766 17.2113 23.4171 15.2124 23.3933 13.8967C23.1785 11.335 19.2178 9.78638 16.8756 8.87427C17.0963 8.3148 17.1648 7.70904 17.0744 7.11605C16.6171 6.09138 15.6547 5.95166 14.7162 5.67997C13.0063 5.21033 10.2505 4.99298 8.99783 3.9101C7.74519 2.82721 8.31385 1.63954 8.628 0.397522C5.3433 3.84023 5.16832 4.27882 5.16832 4.27882ZM15.4718 9.65829C15.8886 9.88071 16.2331 10.2129 16.466 10.617L12.887 10.0503C13.5988 9.55738 14.6765 9.14985 15.4718 9.65829Z"
              fill="white"
            />
            <path
              d="M35.8481 17.0366C35.7422 16.9464 35.6261 16.8683 35.5021 16.8037C35.2729 16.671 35.0352 16.5531 34.7903 16.4505C34.4899 16.3202 34.1802 16.2112 33.8637 16.1245C33.5334 16.0356 33.1924 15.9899 32.8497 15.9887C32.4947 15.9668 32.141 16.0464 31.8317 16.2177C31.7178 16.2916 31.6254 16.393 31.5634 16.512C31.5014 16.631 31.4719 16.7635 31.4777 16.8969C31.4712 17.0646 31.5277 17.2289 31.6368 17.3588C31.7625 17.498 31.9152 17.6114 32.0862 17.6926C32.3187 17.8048 32.5626 17.8933 32.8139 17.9565C33.1002 18.0419 33.4343 18.135 33.812 18.2359C34.3063 18.3656 34.7923 18.5238 35.2675 18.7095C35.6687 18.8587 36.0422 19.0711 36.373 19.3382C36.6749 19.5883 36.9155 19.9013 37.0769 20.2542C37.2487 20.6653 37.3313 21.1067 37.3194 21.5506C37.3343 22.0886 37.2127 22.6219 36.9655 23.1031C36.7395 23.5152 36.4165 23.869 36.023 24.1355C35.6139 24.4058 35.1567 24.5993 34.675 24.7061C34.1536 24.8257 33.6198 24.8856 33.0843 24.8846C32.665 24.8819 32.2465 24.8508 31.8317 24.7915C31.4069 24.7289 30.9871 24.6382 30.575 24.5198C30.169 24.4023 29.7706 24.261 29.382 24.0967C29.0076 23.9379 28.6482 23.747 28.3083 23.5261L29.4536 21.3565C29.59 21.4628 29.7335 21.56 29.8831 21.6476C30.1554 21.8117 30.4398 21.9557 30.7341 22.0784C31.1041 22.2319 31.484 22.3616 31.8714 22.4666C32.289 22.5761 32.7195 22.6322 33.1519 22.6335C34.0665 22.6335 34.5278 22.3579 34.5278 21.8145C34.5302 21.7205 34.5131 21.6271 34.4775 21.5397C34.442 21.4523 34.3888 21.3729 34.321 21.306C34.159 21.1493 33.9707 21.0207 33.7643 20.9257C33.4874 20.8086 33.2032 20.7088 32.9133 20.6268C32.5832 20.5337 32.2254 20.4328 31.8396 20.3163C31.3743 20.1811 30.9209 20.0098 30.4836 19.804C30.1367 19.645 29.8174 19.4341 29.5371 19.1791C29.2974 18.9535 29.1114 18.6792 28.9923 18.3757C28.8664 18.0295 28.8057 17.6639 28.8134 17.2967C28.8034 16.7704 28.9163 16.2487 29.1434 15.7713C29.3579 15.3393 29.6659 14.9579 30.0461 14.6535C30.4315 14.3503 30.8729 14.1224 31.3465 13.982C31.861 13.8239 32.3977 13.7453 32.9372 13.7492C33.3307 13.7486 33.7234 13.7837 34.1103 13.854C34.4753 13.9245 34.8352 14.0179 35.188 14.1334C35.5199 14.2416 35.844 14.3712 36.1583 14.5215C36.4658 14.6639 36.7402 14.8075 36.9814 14.9524L35.8481 17.0366Z"
              fill="white"
            />
            <path
              d="M40.8903 24.9235C40.5294 24.9468 40.1678 24.889 39.8334 24.7544C39.499 24.6198 39.2008 24.4121 38.9616 24.1472C38.4725 23.4833 38.2375 22.6729 38.2975 21.8572V16.699H40.8267V21.3177C40.8005 21.7168 40.9049 22.1137 41.1249 22.4511C41.2228 22.5795 41.3517 22.6821 41.5003 22.7499C41.6488 22.8176 41.8122 22.8483 41.9759 22.8392C42.3201 22.8369 42.6576 22.7459 42.9542 22.5753C43.3152 22.3548 43.6058 22.0402 43.7932 21.667V16.699H46.3184V22.0164C46.2967 22.2 46.3479 22.3847 46.4616 22.5326C46.6036 22.6474 46.7821 22.7106 46.9666 22.7111V24.7721C46.7393 24.8177 46.5096 24.8514 46.2786 24.873C46.0798 24.873 45.9128 24.8963 45.7656 24.8963C44.8828 24.8963 44.3725 24.5521 44.2346 23.8639L44.1869 23.3709C43.8322 23.8774 43.3428 24.2799 42.7713 24.5353C42.1808 24.7971 41.5388 24.9295 40.8903 24.9235V24.9235Z"
              fill="white"
            />
            <path
              d="M56.2045 24.7721H53.6793V20.2271C53.7135 19.8159 53.6042 19.4055 53.3692 19.0627C53.2708 18.9454 53.1461 18.8518 53.0048 18.7892C52.8634 18.7266 52.7091 18.6967 52.5539 18.7017C52.3673 18.7034 52.1825 18.739 52.0091 18.8065C51.8216 18.8802 51.6471 18.9824 51.4922 19.1093C51.3226 19.2405 51.1704 19.3917 51.0388 19.5595C50.9042 19.7339 50.7982 19.9277 50.7247 20.1339V24.7721H48.1956V16.699H50.4662V18.0535C50.7783 17.5672 51.2288 17.1801 51.7626 16.9396C52.3662 16.6708 53.024 16.5382 53.6873 16.5515C54.1389 16.5308 54.5879 16.6286 54.9876 16.8348C55.307 17.0102 55.5722 17.2662 55.7551 17.5761C55.9358 17.8831 56.0571 18.2199 56.113 18.5698C56.1689 18.9152 56.1982 19.2642 56.2005 19.6138L56.2045 24.7721Z"
              fill="white"
            />
            <path
              d="M61.1433 24.9234C60.6027 24.9288 60.0672 24.8217 59.5725 24.6091C59.0997 24.4026 58.6769 24.1011 58.3318 23.7241C57.9847 23.3307 57.715 22.878 57.5365 22.389C57.3362 21.8545 57.2365 21.2891 57.2422 20.72C57.2389 20.1581 57.3302 19.5995 57.5126 19.0666C57.6778 18.5801 57.9355 18.1285 58.2721 17.7353C58.5932 17.366 58.9884 17.0649 59.4333 16.8503C59.8923 16.6314 60.3978 16.521 60.9087 16.5282C61.4545 16.5187 61.993 16.6528 62.4675 16.9163C62.9282 17.1679 63.3061 17.5421 63.5571 17.9953V13.5241H66.0823V21.997C66.0567 22.1815 66.1035 22.3687 66.2135 22.5209C66.3555 22.6358 66.5341 22.6989 66.7185 22.6995V24.7721C66.4913 24.818 66.2616 24.8517 66.0306 24.873C65.8357 24.873 65.6608 24.8963 65.5017 24.8963C64.6189 24.873 64.1099 24.5314 63.9866 23.8639L63.9389 23.4291C63.6604 23.9085 63.2462 24.2994 62.7459 24.5547C62.2503 24.8029 61.7002 24.9294 61.1433 24.9234ZM61.8193 22.847C62.1753 22.8441 62.5225 22.7388 62.8174 22.5442C63.1374 22.3393 63.3944 22.0536 63.5611 21.7175V20.0253C63.4086 19.6278 63.1422 19.2815 62.7936 19.0278C62.4828 18.7817 62.0962 18.645 61.696 18.6396C61.4341 18.6361 61.1754 18.6975 60.9444 18.8182C60.7195 18.9352 60.5197 19.0933 60.3559 19.2839C60.1804 19.4837 60.0455 19.7142 59.9582 19.9632C59.8697 20.2261 59.8253 20.5014 59.827 20.7782C59.8053 21.328 60.0019 21.8647 60.3758 22.2764C60.5605 22.4668 60.785 22.6163 61.0341 22.7147C61.2831 22.8131 61.5509 22.8582 61.8193 22.847V22.847Z"
              fill="white"
            />
            <path
              d="M71.4231 24.9234C71.0638 24.9244 70.705 24.8997 70.3494 24.8497C69.9756 24.7992 69.6058 24.7294 69.2399 24.644C68.8805 24.5594 68.5271 24.4518 68.1821 24.3218C67.8744 24.2078 67.5787 24.0648 67.2993 23.8949L68.2895 22.2337C68.7934 22.5219 69.3265 22.7586 69.8802 22.9401C70.3576 23.1006 70.8585 23.1845 71.3635 23.1885C71.6551 23.2061 71.9462 23.1472 72.2065 23.0177C72.2977 22.9698 72.3733 22.8978 72.4247 22.81C72.476 22.7221 72.501 22.622 72.4968 22.5209C72.4913 22.4077 72.4502 22.2988 72.379 22.2092C72.3079 22.1196 72.2101 22.0536 72.0991 22.0202C71.6594 21.8477 71.2076 21.7064 70.7471 21.5972C70.2659 21.4781 69.792 21.333 69.3274 21.1625C68.9904 21.0487 68.6728 20.8865 68.3849 20.6812C68.1664 20.5221 67.9916 20.3128 67.8759 20.0718C67.7621 19.8189 67.7064 19.5446 67.7129 19.2684C67.7086 18.8783 67.7985 18.4927 67.9753 18.1428C68.1478 17.8065 68.3951 17.5121 68.6991 17.2812C69.0211 17.0365 69.3845 16.8486 69.7728 16.7261C70.2153 16.5903 70.6769 16.5235 71.1408 16.5282C71.7425 16.5301 72.3409 16.6151 72.9183 16.7805C73.5319 16.9534 74.1261 17.1862 74.6919 17.4752L73.6978 19.0277C73.2569 18.783 72.7936 18.579 72.3139 18.4184C71.9293 18.2924 71.5266 18.2269 71.1209 18.2243C70.8458 18.2105 70.5717 18.2667 70.3256 18.3873C70.2278 18.4343 70.1462 18.5082 70.0911 18.6C70.036 18.6918 70.0096 18.7973 70.0154 18.9035C70.0138 19.0042 70.0399 19.1033 70.0909 19.1908C70.1627 19.2801 70.2536 19.3529 70.3574 19.4042C70.5105 19.483 70.6718 19.5454 70.8385 19.5905C71.0374 19.6449 71.2839 19.7109 71.5782 19.7807C72.1906 19.936 72.7036 20.0912 73.1251 20.2426C73.4918 20.3678 73.8385 20.5429 74.1551 20.7627C74.3979 20.9287 74.5925 21.1534 74.7198 21.4147C74.8418 21.6915 74.9014 21.9907 74.8947 22.2919C74.9012 22.6676 74.8182 23.0397 74.6522 23.3787C74.4872 23.7054 74.2445 23.9889 73.9443 24.2054C73.6128 24.444 73.2395 24.6215 72.8428 24.7294C72.3808 24.8567 71.9032 24.922 71.4231 24.9234V24.9234Z"
              fill="white"
            />
            <path
              d="M77.9409 24.7721L75.0061 16.699H77.5949L79.4122 22.8198L81.2415 16.699H83.6274L80.6887 24.7721H77.9409Z"
              fill="white"
            />
            <path
              d="M86.5145 24.9235C86.1254 24.9277 85.7388 24.8633 85.3732 24.7333C85.0366 24.6131 84.7272 24.4298 84.4626 24.1938C84.2108 23.9623 84.0093 23.6838 83.87 23.3748C83.7149 23.041 83.6377 22.6778 83.6439 22.3113C83.6501 21.9448 83.7395 21.5843 83.9058 21.2556C84.0839 20.9239 84.3352 20.635 84.6415 20.4095C84.9776 20.1618 85.3559 19.9739 85.7589 19.8545C86.2256 19.7166 86.7109 19.6485 87.1985 19.6527C87.537 19.6533 87.8749 19.6818 88.2086 19.7381C88.5026 19.7861 88.7888 19.8723 89.0596 19.9942V19.6061C89.0596 18.6746 88.5108 18.2049 87.4013 18.2049C86.9602 18.2046 86.5226 18.2808 86.1089 18.4301C85.6505 18.6019 85.2152 18.8273 84.8125 19.1015L84.0728 17.549C84.5997 17.2129 85.1727 16.9516 85.7749 16.7727C86.3853 16.596 87.0191 16.5084 87.6558 16.5127C88.9084 16.5127 89.8788 16.7999 90.5588 17.3743C90.9128 17.6937 91.1891 18.0865 91.3673 18.5237C91.5455 18.9609 91.6212 19.4316 91.5887 19.9011V21.9814C91.569 22.1649 91.62 22.349 91.7319 22.4977C91.8739 22.6125 92.0524 22.6756 92.2369 22.6762V24.7721C92.0153 24.8199 91.7909 24.8536 91.5648 24.873C91.3581 24.873 91.1672 24.8963 91.02 24.8963C90.6466 24.9096 90.2778 24.8122 89.9623 24.6168C89.8387 24.5272 89.7346 24.4145 89.6561 24.2852C89.5776 24.1559 89.5262 24.0127 89.5049 23.8639L89.4572 23.4757C89.1046 23.9226 88.6533 24.2861 88.137 24.5392C87.6348 24.7904 87.0788 24.922 86.5145 24.9235V24.9235ZM87.2542 23.1536C87.5256 23.153 87.7948 23.1057 88.0495 23.0139C88.2865 22.9282 88.503 22.7961 88.6858 22.6257C88.7879 22.5615 88.8737 22.4753 88.9364 22.3737C88.9992 22.2721 89.0372 22.1578 89.0476 22.0397V21.2634C88.8154 21.1789 88.5759 21.1153 88.3318 21.0732C88.0946 21.0288 87.8537 21.0054 87.6121 21.0034C87.2074 20.9853 86.8075 21.0941 86.4708 21.3139C86.3294 21.4002 86.2139 21.5214 86.1357 21.6651C86.0575 21.8089 86.0195 21.9702 86.0254 22.1328C86.0223 22.2725 86.0522 22.411 86.1129 22.5376C86.1736 22.6642 86.2634 22.7753 86.3753 22.8625C86.6222 23.0608 86.9347 23.1643 87.2542 23.1536V23.1536Z"
              fill="white"
            />
            <path
              d="M93.2867 13.5241H95.7999V21.7447C95.7999 22.3618 96.0703 22.6723 96.6191 22.6723C96.7538 22.6677 96.8874 22.6468 97.0168 22.6102C97.1545 22.572 97.2877 22.52 97.4144 22.4549L97.7882 24.4616C97.4403 24.6167 97.0745 24.73 96.6986 24.7992C96.325 24.8794 95.9438 24.921 95.5613 24.9234C94.9485 24.9605 94.345 24.7628 93.8792 24.3723C93.6726 24.1594 93.5133 23.9071 93.4113 23.6313C93.3093 23.3554 93.2669 23.0619 93.2867 22.7693V13.5241Z"
              fill="white"
            />
            <path
              d="M98.4802 13.5241H101.009V21.7447C101.009 22.3618 101.284 22.6723 101.829 22.6723C101.963 22.6677 102.097 22.6468 102.226 22.6102C102.371 22.5739 102.511 22.5219 102.644 22.455L102.978 24.4422C102.63 24.5984 102.264 24.7118 101.888 24.7799C101.515 24.8602 101.133 24.9018 100.751 24.9041C100.139 24.9413 99.5369 24.7435 99.0727 24.3529C98.8648 24.1408 98.7043 23.8887 98.6016 23.6127C98.4989 23.3367 98.4562 23.0429 98.4762 22.7499L98.4802 13.5241Z"
              fill="white"
            />
            <path
              d="M107.165 24.9234C106.803 24.9236 106.441 24.8977 106.083 24.8458C105.71 24.7953 105.336 24.7255 104.974 24.6401C104.613 24.5549 104.259 24.4473 103.912 24.3179C103.605 24.2031 103.309 24.0602 103.029 23.891L104.023 22.2298C104.527 22.5182 105.06 22.7549 105.614 22.9362C106.092 23.0961 106.593 23.18 107.097 23.1846C107.39 23.2022 107.683 23.1432 107.944 23.0138C108.035 22.9665 108.111 22.8952 108.162 22.8081C108.213 22.7209 108.239 22.6214 108.235 22.5209C108.23 22.4075 108.189 22.2984 108.118 22.2087C108.046 22.119 107.948 22.0531 107.837 22.0202C107.396 21.8476 106.943 21.7062 106.481 21.5972C105.999 21.4781 105.523 21.333 105.057 21.1625C104.721 21.0496 104.405 20.8873 104.119 20.6812C103.899 20.5222 103.723 20.3129 103.606 20.0718C103.495 19.8182 103.442 19.544 103.451 19.2684C103.445 18.8786 103.534 18.493 103.709 18.1428C103.88 17.8067 104.126 17.5123 104.429 17.2812C104.752 17.0357 105.117 16.8478 105.507 16.7261C105.949 16.5903 106.411 16.5235 106.875 16.5282C107.475 16.5302 108.072 16.6151 108.648 16.7805C109.266 16.952 109.864 17.1848 110.434 17.4752L109.44 19.0277C109 18.7831 108.538 18.5791 108.06 18.4184C107.675 18.2927 107.272 18.2272 106.867 18.2243C106.592 18.2124 106.318 18.2685 106.071 18.3873C105.975 18.4352 105.894 18.5095 105.84 18.6011C105.786 18.6928 105.76 18.7978 105.765 18.9035C105.762 19.0044 105.788 19.104 105.841 19.1908C105.92 19.288 106.023 19.3652 106.139 19.4159C106.293 19.4951 106.456 19.5576 106.624 19.6022C106.823 19.6565 107.07 19.7225 107.364 19.7924C107.972 19.9476 108.485 20.1029 108.911 20.2542C109.276 20.3794 109.622 20.5545 109.937 20.7743C110.183 20.9404 110.381 21.1648 110.513 21.4264C110.635 21.7032 110.695 22.0023 110.688 22.3036C110.693 22.6795 110.609 23.0516 110.442 23.3903C110.272 23.7184 110.023 24.0018 109.718 24.217C109.385 24.4548 109.01 24.6323 108.613 24.741C108.141 24.8665 107.654 24.9279 107.165 24.9234Z"
              fill="white"
            />
            <path
              d="M34.4642 38.6361L32.2969 35.3874L31.4141 36.284V38.6361H28.8889V27.3803H31.4141V33.9009L34.2216 30.5397H36.9098L33.9234 34.0329L37.1444 38.6361H34.4642Z"
              fill="white"
            />
            <path
              d="M41.2525 38.7913C40.6061 38.8024 39.964 38.6876 39.3636 38.4537C38.8378 38.2451 38.3624 37.9318 37.9678 37.5338C37.5904 37.1496 37.2981 36.6938 37.1088 36.1947C36.7163 35.1658 36.7163 34.0333 37.1088 33.0043C37.2981 32.5052 37.5904 32.0494 37.9678 31.6653C38.3652 31.2685 38.8397 30.9532 39.3636 30.7376C39.9627 30.4987 40.6054 30.3811 41.2525 30.3922C41.8957 30.3815 42.5344 30.4991 43.1295 30.7376C43.6452 30.9551 44.1116 31.2704 44.5014 31.6653C44.8883 32.0458 45.1902 32.5004 45.3882 33.0004C45.5888 33.5108 45.6913 34.0529 45.6904 34.5995C45.6913 35.1429 45.5916 35.682 45.3961 36.1909C45.2028 36.7008 44.9018 37.1654 44.5127 37.5545C44.1236 37.9437 43.655 38.2487 43.1374 38.4498C42.5386 38.6848 41.8978 38.8009 41.2525 38.7913V38.7913ZM39.4033 34.6034C39.3746 35.1588 39.5605 35.7046 39.9243 36.1326C40.0876 36.3195 40.2916 36.4683 40.5214 36.5684C40.7512 36.6684 41.001 36.7171 41.2525 36.711C41.5028 36.7144 41.7505 36.6613 41.9762 36.5557C42.1978 36.4539 42.3955 36.3086 42.5568 36.1288C42.7306 35.9307 42.8654 35.7031 42.9545 35.4573C43.0538 35.1832 43.1022 34.8941 43.0976 34.6034C43.1313 34.0402 42.9452 33.4855 42.5767 33.0509C42.4164 32.8656 42.2158 32.7175 41.9895 32.6175C41.7632 32.5174 41.5168 32.4679 41.2684 32.4726C41.0145 32.4715 40.7635 32.5245 40.5327 32.6278C40.309 32.7279 40.1108 32.875 39.9521 33.0586C39.7746 33.2541 39.6394 33.4825 39.5545 33.7301C39.452 34.0103 39.4008 34.3059 39.4033 34.6034V34.6034Z"
              fill="white"
            />
            <path
              d="M59.8511 38.6361H57.322V34.0911C57.3563 33.6825 57.2545 33.2741 57.0317 32.9267C56.939 32.8081 56.8182 32.7133 56.6796 32.6504C56.5411 32.5875 56.3889 32.5585 56.2363 32.5657C55.8707 32.5763 55.521 32.7139 55.2501 32.9538C54.9224 33.2289 54.68 33.5878 54.5502 33.9902V38.6361H52.0569V34.0911C52.09 33.6821 51.9868 33.2737 51.7626 32.9267C51.6695 32.8086 51.5486 32.7141 51.4102 32.6513C51.2717 32.5885 51.1198 32.5591 50.9673 32.5657C50.6017 32.5766 50.2521 32.7142 49.9811 32.9538C49.6491 33.2314 49.4038 33.5946 49.2732 34.0018V38.6361H46.748V30.5474H49.0227V31.9059C49.3194 31.4204 49.7528 31.0284 50.2714 30.7764C50.8417 30.5093 51.4682 30.3764 52.1006 30.3883C52.4064 30.3824 52.7111 30.4243 53.0033 30.5125C53.2445 30.5861 53.4706 30.7004 53.6714 30.8502C53.8514 30.991 54.006 31.1602 54.1287 31.3509C54.2477 31.541 54.3362 31.7478 54.3912 31.9641C54.6851 31.4731 55.1115 31.0704 55.6239 30.7997C56.1703 30.5292 56.7771 30.3958 57.3896 30.4116C57.8326 30.3922 58.2727 30.4915 58.6621 30.6988C58.9722 30.8777 59.2297 31.1317 59.4097 31.4363C59.5903 31.743 59.7103 32.08 59.7636 32.4299C59.8226 32.7763 59.8532 33.1267 59.8551 33.4778L59.8511 38.6361Z"
              fill="white"
            />
            <path
              d="M74.4374 38.6361H71.9122V34.0911C71.9454 33.6821 71.8421 33.2737 71.618 32.9267C71.5253 32.8081 71.4045 32.7133 71.2659 32.6504C71.1274 32.5875 70.9753 32.5585 70.8226 32.5657C70.4557 32.5757 70.1045 32.7134 69.8324 32.9538C69.5129 33.2361 69.2791 33.5986 69.1564 34.0018V38.6361H66.6273V34.0911C66.6616 33.6825 66.5598 33.2741 66.337 32.9267C66.2448 32.8076 66.1241 32.7124 65.9854 32.6495C65.8467 32.5865 65.6944 32.5578 65.5417 32.5657C65.176 32.5759 64.8261 32.7136 64.5554 32.9538C64.2242 33.2298 63.9801 33.5918 63.8516 33.9979V38.6361H61.3264V30.5474H63.5891V31.9059C63.8869 31.4212 64.32 31.0294 64.8378 30.7764C65.4081 30.5093 66.0346 30.3764 66.667 30.3883C66.9728 30.3824 67.2776 30.4243 67.5697 30.5125C67.8109 30.5861 68.037 30.7004 68.2378 30.8502C68.419 30.991 68.5749 31.1602 68.6991 31.3509C68.8168 31.5412 68.904 31.748 68.9576 31.9641C69.2526 31.474 69.6788 31.0715 70.1903 30.7997C70.7383 30.5296 71.3463 30.3963 71.96 30.4116C72.4018 30.3921 72.8406 30.4915 73.2285 30.6988C73.5394 30.8767 73.7971 31.131 73.9761 31.4363C74.1562 31.7435 74.2775 32.0802 74.334 32.4299C74.3898 32.7766 74.4191 33.1269 74.4215 33.4778L74.4374 38.6361Z"
              fill="white"
            />
            <path
              d="M78.446 38.7913C78.0859 38.8123 77.7257 38.7534 77.3923 38.619C77.0589 38.4845 76.7611 38.278 76.5213 38.0151C76.0317 37.3485 75.7981 36.5351 75.8612 35.7173V30.5474H78.3824V35.1856C78.3574 35.5851 78.4632 35.982 78.6846 36.3189C78.7832 36.4466 78.9123 36.5487 79.0606 36.6163C79.209 36.684 79.3721 36.7151 79.5356 36.7071C79.8806 36.705 80.2191 36.6154 80.5178 36.447C80.8758 36.2242 81.1645 35.9101 81.3529 35.5388V30.5474H83.8701V35.8648C83.8537 36.048 83.9044 36.2309 84.0133 36.381C84.1559 36.4945 84.3344 36.5562 84.5183 36.5557V38.6361C84.2927 38.6836 84.0643 38.7173 83.8344 38.737C83.6395 38.737 83.4645 38.7603 83.3174 38.7603C82.4346 38.7603 81.9216 38.4071 81.7864 37.7278L81.7387 37.2349C81.3867 37.7423 80.8982 38.1452 80.327 38.3993C79.737 38.6631 79.0949 38.7969 78.446 38.7913V38.7913Z"
              fill="white"
            />
            <path
              d="M93.7598 38.6361H91.2347V34.0911C91.2706 33.6803 91.1627 33.2698 90.9285 32.9267C90.8301 32.8094 90.7054 32.7158 90.5641 32.6532C90.4227 32.5906 90.2684 32.5607 90.1133 32.5657C89.9273 32.5662 89.7434 32.6032 89.5724 32.6744C89.3832 32.7472 89.2073 32.8494 89.0515 32.9771C88.8819 33.1098 88.7296 33.2623 88.5982 33.4312C88.4614 33.6029 88.3552 33.7958 88.284 34.0018V38.6361H85.7549V30.5474H88.0295V31.9059C88.3401 31.4174 88.7909 31.0287 89.3259 30.7881C89.929 30.5179 90.5872 30.3852 91.2506 30.4C91.7037 30.3815 92.1538 30.4806 92.5549 30.6872C92.8713 30.8633 93.1346 31.1177 93.3184 31.4246C93.5007 31.7306 93.6208 32.0679 93.6723 32.4182C93.7301 32.7647 93.7594 33.1151 93.7598 33.4662V38.6361Z"
              fill="white"
            />
          </svg>
        </div>
      </Footer>
    </div>
  );
}
