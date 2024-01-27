import config from "@config/config.json";
import { DiscussionEmbed } from "disqus-react";
import React from "react";

const Disqus = ({ className }: { className?: string }) => {
  const { disqus } = config;
  return (
    <>
    {disqus.enable && (
      <div className={className}>
        <hr className="mb-20" />
        <DiscussionEmbed
          shortname={disqus.shortname}
          config={disqus.settings}
        />
      </div>
    )}
    </>
  );
};

export default Disqus;
