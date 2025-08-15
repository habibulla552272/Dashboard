export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/dashboard/:path*", "/services", "/strategy", "/blogs", "/solutions", "/payments", "/datasets", "/staffing-need", "/settings"],
};
