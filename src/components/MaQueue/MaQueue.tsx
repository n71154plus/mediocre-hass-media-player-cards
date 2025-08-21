import { css } from "@emotion/react";
import { searchStyles } from "@components/MediaSearch";
import { MediaTrack, Spinner } from "@components";
import { useQueue } from "./useQueue";

export type MaQueueProps = {
  entityId: string;
  horizontalPadding?: number;
  maxHeight?: number;
};

const styles = {
  container: (horizontalPadding: number) =>
    css({
      "--mmpc-search-padding": `${horizontalPadding}px`,
    }),
};

export const MaQueue = ({
  entityId,
  horizontalPadding = 0,
  maxHeight = 300,
}: MaQueueProps) => {
  const { queue, loading } = useQueue(entityId);

  if (loading) {
    return <Spinner />;
  }

  if (!queue || queue.items?.length === 0) {
    return <p css={searchStyles.mediaEmptyText}>Queue is empty</p>;
  }

  return (
    <div
      css={[searchStyles.root, styles.container(horizontalPadding)]}
      style={{ maxHeight }}
    >
      <div css={searchStyles.resultsContainerSearchBarBottom}>
        {(queue.items ?? []).map(item => (
          <MediaTrack
            key={item.queue_item_id}
            imageUrl={item.media_item.image ?? item.media_item.album?.image}
            title={item.media_item.name}
            artist={item.media_item.artists
              ?.map(artist => artist.name)
              .join(", ")}
            onClick={async () => {}}
          />
        ))}
      </div>
    </div>
  );
};

