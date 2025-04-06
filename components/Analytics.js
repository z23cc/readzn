// Analytics.js
export default function Analytics() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          !(function () {
            "use strict";
            var w = window,
                d = document,
                u = "//api.tongjiniao.com/c?_=767277299839270912",
                s = document.createElement("script"),
                r = document.getElementsByTagName("script")[0];
            s.type = "text/javascript";
            s.setAttribute("charset", "UTF-8");
            s.async = !0;
            s.src = u;
            r.parentNode.insertBefore(s, r);
          })();
        `,
      }}
    />
  );
}
