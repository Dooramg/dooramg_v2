/**
 * ! Global Interface !
 */

interface Window {
  AppleID: any
  naver: any
  skipWaiting: any
  __WB_MANIFEST: any
}

type SerializeObject = /* unresolved */ any

interface SelectOption {
  value: string
  label: string
}

interface ResWithCount {
  data: any
  count: number
}

interface NaverResAddr {
  jibunAddress: string
  roadAddress: string
}

interface Code {
  code: string
  codeName: string
}
interface UserData {
  address?: string | undefined | null
  addressDetail?: string | undefined | null
  avatarImage?: string | undefined | null
  avatarImageName?: string | undefined | null
  createdAt?: string | undefined | null
  email?: string | undefined | null
  id: string
  isAdmin?: boolean | undefined | null
  mainVehicleId?: string | undefined | null
  mobile?: string | undefined | null
  nickName: string | undefined | null
  signInAt?: string | undefined | null
}

interface FuelData {
  id: string
  code: string
  codeName: string
  opiCode: string
  createdAt?: string
}

interface ManufacturerData {
  id?: string
  logoImage: string
  name: string
}

interface VehicleModelData {
  id?: string
  name: string
  years?: string
  manufacturerId?: string
  createdAt?: string
}

interface VehicleCarNickName {
  carNickName: string
}

interface DeleteUpdateVehicle {
  currentFuelAmount: number
  totalDistance: number
  totalEfficient: number
  totalFuelAmount: number
  totalPaidAmount: number
}

type StoreVehicleData = SupabaseDataBase['public']['Tables']['vehicles']['Row'] & {
  fuelData: {
    id: SupabaseDataBase['public']['Tables']['fuelData']['Row']['id']
    code: SupabaseDataBase['public']['Tables']['fuelData']['Row']['code']
    codeName: SupabaseDataBase['public']['Tables']['fuelData']['Row']['codeName']
    opiCode: SupabaseDataBase['public']['Tables']['fuelData']['Row']['opiCode']
    createdAt?: SupabaseDataBase['public']['Tables']['fuelData']['Row']['createdAt']
  }
  vehicleModel: {
    id?: SupabaseDataBase['public']['Tables']['vehicleModel']['Row']['id']
    name: SupabaseDataBase['public']['Tables']['vehicleModel']['Row']['name']
    years?: SupabaseDataBase['public']['Tables']['vehicleModel']['Row']['years']
    manufacturerId?: SupabaseDataBase['public']['Tables']['vehicleModel']['Row']['manufacturerId']
    createdAt?: SupabaseDataBase['public']['Tables']['vehicleModel']['Row']['createdAt']
  }
  manufacturer: {
    id?: SupabaseDataBase['public']['Tables']['manufacturer']['Row']['id']
    name: SupabaseDataBase['public']['Tables']['manufacturer']['Row']['name']
    logoImage: SupabaseDataBase['public']['Tables']['manufacturer']['Row']['logoImage']
    orderBy?: SupabaseDataBase['public']['Tables']['manufacturer']['Row']['orderBy']
    createdAt?: SupabaseDataBase['public']['Tables']['manufacturer']['Row']['createdAt']
  }
}

interface VehicleDetail extends VehicleCarNickName {
  bikeImage: string
  bikeImageName: string
  carNumber: string
  createdAt: string
  currentFuelAmount: number
  displacement: number
  fuelData: FuelData
  fuelTypeId: string
  id: string
  insureceId: string
  makeYear: string
  manufacturer: ManufacturerData
  manualModelName: string
  manufacturerId: string
  memo: string
  officialFuelEfficient: number
  plateHeadText: string
  plateMiddleText: string
  plateNumber: string
  plateTailText: string
  tankSize: number
  tireTypeId: string
  totalDistance: number
  totalEfficient: number
  totalFuelAmount: number
  totalPaidAmount: number
  userId: string
  vehicleModel: VehicleModelData
  vehicleModelId: string
}

interface InsertVehicleData {
  plateHeadText: string
  plateMiddleText: string
  plateTailText: string
  plateNumber?: string
  carNumber?: string
  carNickName?: string
  manufacturerId?: string
  manualModelName?: string
  vehicleModelId?: string
  makeYear?: string
  fuelTypeId?: string
}

interface UpdateVehicleData {
  bikeImageName?: string
  bikeImage?: string
  displacement?: number
  totalDistance?: number
  totalFuelAmount?: number
  totalEfficient?: number
  fuelTypeId?: string
  tankSize?: number
  manualModelName?: string
  officialFuelEfficient?: number
  memo?: string
}

interface OpiApiData {
  DISTANCE: number
  GIS_X_COOR: number
  GIS_Y_COOR: number
  OS_NM: string
  POLL_DIV_CD: string
  PRICE: number
  UNI_ID: string
  fuelTypeName?: string
  stationImage?: string
}

interface FuelStationData {
  code: string
  createdAt: string
  id: string
  logoImage: string
  name: string
}

interface ManageVehicleData {
  vehicleId?: string
  manageTypeId?: string
  userId?: string
  title?: string
  memo?: string
  currentFuelAmount?: number
  driveDistance: number
  totalDistance: number
  fuelAmount: number
  paidAmount: number
  efficient: number
  destination?: string
  fuelStationName?: string
  fuelStationCode?: string
  stationImage?: string
}

interface DiaryData {
  createdAt: string
  destination: string
  driveDistance: number
  efficient: number
  fuelAmount: number
  fuelStationCode: string
  fuelStationName: string
  id: string
  manageType: Code
  manageTypeId: string
  memo: string
  paidAmount: number
  stationImage: string
  title: string
  totalDistance: number
  userId: string
  vehicleId: string
  vehicles: VehicleCarNickName
}

interface LikeCountData {
  id?: string
  boardId: string
  userId: string
  likeCount: number | undefined
  createdAt?: string
}

interface BoardUserInfo {
  nickName: string
  isAdmin: boolean
}

interface BoardData {
  id: string
  userId: string
  title: string
  content: string
  createdAt: string
  userInfo?: BoardUserInfo
  noticeLikeCount?: LikeCountData[]
  communityLikeCount?: LikeCountData[]
  isPublished: boolean
  likeCount?: number
  useLocation: boolean
  locationAddress: string
  latitude: number
  longitude: number
}

interface CommentForm {
  boardId: string
  userId: string
  comment: string
}

interface CommentData {
  id: string
  boardId: string
  userId: string
  comment: string
  likeCount: number
  userInfo: BoardUserInfo
  createdAt: string
}
