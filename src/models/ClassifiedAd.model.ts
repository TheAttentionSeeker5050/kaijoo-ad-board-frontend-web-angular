import { CategoryRelation } from "./Category.model";
import { ConversationRelation } from "./Conversation.model";
import { MediaItemRelation } from "./MediaItem.model";
import { OwnerRelation } from "./Owner.model";
import { SocialLinkRelation } from "./SocialLink.model";
import { SubCategoryRelation } from "./SubCategory.model";
import { TagRelation } from "./Tag.model";

export interface ClassifiedAdsItem {
  id: number;
  title: string;
  description: string;
  address: string;
  thumbnail: string;
  phone: string;
  price: number;
  email: string;
  tags: TagRelation[];
  subCategory: SubCategoryRelation;
  category: CategoryRelation;
  owner: OwnerRelation;
  mediaItems: MediaItemRelation[];
  socialLinks: SocialLinkRelation[];
  conversations: ConversationRelation[];
};
