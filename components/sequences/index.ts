import Card from './Card'
import OrdersPreview from './OrdersPreview'
import SequenceActions from './SequenceActions'
import SequenceActivities from './SequenceActivities'
import SequenceList from './SequenceList'
import SequenceSchedule from './SequenceSchedule'
import L from "later";
import NewSequence from './NewSequence'

// Load the browser version
const later: typeof L = require("later/index-browserify");

export {
    SequenceList,
    Card,
    OrdersPreview,
    SequenceActions,
    SequenceActivities,
    SequenceSchedule,
    later,
    NewSequence,
}
