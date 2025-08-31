import { Link } from "react-router-dom";

function Breadcrumb({ path }: { path: string }) {
  let splitted: string[] = [];

  if (path == "/") {
    splitted.push("Dahsboard");
  } else {
    splitted = path.split("/");
    splitted = splitted.slice(1);
  }

  return (
    <div className="z-10 absolute mt-20 ml-23">
      {splitted.map((l) => (
        <Link className="text-white italic capitalize text-lg" to={l}>
          {l[0].toUpperCase() + l.slice(1)} {">"}
        </Link>
      ))}
    </div>
  );
}

export default Breadcrumb;
