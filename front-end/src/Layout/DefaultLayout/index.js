import "./DefaultLayout.scss";
import { Header, Sidebar } from "~/components";

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="content">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
export default DefaultLayout;
