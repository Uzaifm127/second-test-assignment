export const fetcher = async <BodyType>(
  url: string,
  method: "GET" | "POST",
  body: BodyType
) => {
  let response;

  if (method === "GET") {
    response = await fetch(url);
  } else {
    response = await fetch(url, { method, body: JSON.stringify(body) });
  }

  if (!response.ok) {
    const responseData = await response.json();

    throw new Error(responseData.message || "Some error occured");
  }

  return response.json();
};
