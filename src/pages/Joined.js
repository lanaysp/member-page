import React, { useState, useEffect } from "react";
import courses from "constants/api/courses";

import ServerError from "pages/500";
import Loading from "parts/Loading";

export default function Joined({ history, match }) {
  const [state, setstate] = useState(() => ({
    isLoading: true,
    isError: false,
    data: {},
  }));

  const joining = React.useCallback(async () => {
    try {
      const details = await courses.details(match.params.class);

      const joined = await courses.join(match.params.class);
      if (joined.data.snap_url) window.location.href = joined.data.snap_url;
      else setstate({ isLoading: false, isError: false, data: details });
    } catch (error) {
      if (error?.response?.data?.message === "user already take this course")
        history.push(`/courses/${match.params.class}`);
    }
  }, [match.params.class]);

  useEffect(() => {
    joining();
  }, [joining]);

  if (state.isLoading) return <Loading></Loading>;
  if (state.isError) return <ServerError></ServerError>;

  return (
    <section className="flex flex-col items-center h-screen mt-24">
      <img
        src={`${process.env.PUBLIC_URL}/assets/images/illustration-joined.jpg`}
        alt="Success join class"
      />
      <h1 className="mt-12 text-3xl text-gray-900">Welcome to Class</h1>
      <p className="mx-auto mt-4 text-lg text-center text-gray-600 mtb-8 lg:w-4/12 xl:w-3/12">
        You have successfully joined our{" "}
        <strong>{state?.data?.name ?? "Class Name"}</strong> class
      </p>
      <Link
        className="px-6 py-3 mt-5 text-white transition-all duration-200 bg-orange-500 shadow-inner cursor-pointer hover:bg-orange-400 focus:outline-none"
        to={`/courses/${match.params.class}`}
      >
        Start learn
      </Link>
    </section>
  );
}
