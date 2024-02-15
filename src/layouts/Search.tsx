import config from "@config/config.json";
import dateFormat from "@lib/utils/dateFormat";
import { humanize, slugify } from "@lib/utils/textConverter";
import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import { BiCalendarEdit, BiCategoryAlt, BiUser } from "react-icons/bi/index.js";
const { summary_length } = config.settings;

export type SearchItem = {
  slug: string;
  data: any;
  content: any;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = new Fuse(searchList, {
    keys: ["data.title", "data.description", "content", "data.categories", "data.tags"],
    includeMatches: true,
    minMatchCharLength: 3,
    ignoreLocation: true,
    threshold: 0.4,
  });

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    let inputResult = inputVal.length > 2 ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(history.state, "", newRelativePathQuery);
    } else {
      history.replaceState(history.state, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <div className="min-h-[45vh]">
      <input
        className="form-input w-full text-center"
        placeholder="Escribe aquí para buscar artículos"
        type="text"
        name="search"
        value={inputVal}
        onChange={handleChange}
        autoComplete="off"
        autoFocus
        ref={inputRef}
      />

      {inputVal.length > 1 && (
        <div className="my-6 text-center">
          Found {searchResults?.length}
          {searchResults?.length && searchResults?.length === 1
            ? " result"
            : " results"}{" "}
          for '{inputVal}'
        </div>
      )}

      <div className="row">
        {searchResults?.map(({ item }) => (
          <div key={item.slug} className={"col-12 mb-8 sm:col-6 text-center"}>
            {item.data.image && (
              <a href={`/${item.slug}`} className="rounded-lg block hover:text-primary overflow-hidden group">
                <img
                  className="group-hover:scale-[1.03] transition duration-300 w-full max-h-52 object-cover"
                  src={item.data.image.src}
                  alt={item.data.title}
                  width={445}
                  height={230}
                />
              </a>
            )}

            <ul className="mt-6 mb-4 flex flex-wrap items-center justify-center text-text">
              <li className="mr-5 flex items-center flex-wrap">
                <BiUser className="mr-1 h-[18px] w-[18px] text-gray-600" />
                <>
                  <ul>
                    {item.data.authors.map((author: string, i: number) => (
                      <li className="inline-block">
                        <a
                          href={`/authors/${slugify(author)}`}
                          className="mr-2 hover:text-primary font-medium"
                        >
                          {humanize(author)}{i !== item.data.authors.length - 1 && ","}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              </li>
              {/*<li className="mr-5 flex items-center flex-wrap font-medium">
                <BiCalendarEdit className="mr-1 h-5 w-5 text-gray-600" />
                <>{dateFormat(item.data.date)}</>
              </li>*/}
              <li className="mr-5 flex items-center flex-wrap">
                <BiCategoryAlt className="mr-1 h-[18px] w-[18px] text-gray-600" />
                <>
                  <ul>
                    {item.data.categories.map((category: string, i: number) => (
                      <li className="inline-block">
                        <a
                          href={`/categories/${slugify(category)}`}
                          className="mr-2 hover:text-primary font-medium"
                        >
                          {humanize(category)}{i !== item.data.categories.length - 1 && ","}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              </li>
            </ul>

            <h3 className="mb-2">
              <a href={`/${item.slug}`} className="block hover:text-primary transition duration-300">
                {item.data.title}
              </a>
            </h3>
            <p className="text-text">
            {
              item.data.description ? item.data.description :
              item.content?.slice(0, Number(summary_length)) + "..."
            }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
