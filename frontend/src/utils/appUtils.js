export const getStage = (item, legalToolType) => {
    if (legalToolType != "Warrant") {
        return ""
    }
    if (item?.visitDateStg1 && item?.policeBailiffStg2 && item?.withLawyerStg3) {
        return "(Completed)"
    }
    if (item?.visitDateStg1 && item?.policeBailiffStg2 && !item?.withLawyerStg3) {
        return "(Stage 3)"
    }
    if (item?.visitDateStg1 && !item?.policeBailiffStg2 && !item?.withLawyerStg3) {
        return "(Stage 2)"
    }
    if (!item?.visitDateStg1 && !item?.policeBailiffStg2 && !item?.withLawyerStg3) {
        return "(Stage 1)"
    }
    else
        return ""
}

